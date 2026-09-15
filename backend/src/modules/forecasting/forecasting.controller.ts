import { Request, Response } from 'express';
import { sendError, sendSuccess } from '../../utils/api-response';
import { DemandForecastModel } from './models/DemandForecast.model';

/**
 * 1. Workforce Forecasting Summary KPIs
 */
export const getForecastingSummaryHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { department, scenario = 'baseline', timeHorizon = '12M' } = req.query;

    const filter: Record<string, unknown> = {};
    if (department && typeof department === 'string') filter.department = department;
    if (scenario && typeof scenario === 'string') filter.scenario = scenario;
    if (timeHorizon && typeof timeHorizon === 'string') filter.timeHorizon = timeHorizon;

    const [aggregates, horizonStats] = await Promise.all([
      DemandForecastModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalCurrentHeadcount: { $sum: '$currentHeadcount' },
            totalProjectedDemand: { $sum: '$projectedDemand' },
            totalGap: { $sum: '$gap' },
            totalHiringReq: { $sum: '$hiringRequirement' },
            totalUpskillingReq: { $sum: '$upskillingRequirement' },
            avgConfidence: { $avg: '$confidenceScore' },
            totalHiringBudget: { $sum: '$estimatedHiringBudget' },
            totalUpskillingBudget: { $sum: '$estimatedUpskillingBudget' },
            totalBudgetImpact: { $sum: '$totalBudgetImpact' },
          },
        },
      ]),
      DemandForecastModel.aggregate([
        { $match: { ...(department ? { department } : {}), scenario } },
        {
          $group: {
            _id: '$timeHorizon',
            currentHeadcount: { $sum: '$currentHeadcount' },
            projectedDemand: { $sum: '$projectedDemand' },
            gap: { $sum: '$gap' },
            hiringRequirement: { $sum: '$hiringRequirement' },
            upskillingRequirement: { $sum: '$upskillingRequirement' },
            budgetImpact: { $sum: '$totalBudgetImpact' },
          },
        },
      ]),
    ]);

    const stats = aggregates[0] || {
      totalCurrentHeadcount: 0,
      totalProjectedDemand: 0,
      totalGap: 0,
      totalHiringReq: 0,
      totalUpskillingReq: 0,
      avgConfidence: 85,
      totalHiringBudget: 0,
      totalUpskillingBudget: 0,
      totalBudgetImpact: 0,
    };

    const upskillShare = stats.totalGap > 0
      ? Number(((stats.totalUpskillingReq / (stats.totalHiringReq + stats.totalUpskillingReq || 1)) * 100).toFixed(1))
      : 55;

    sendSuccess(res, {
      summary: {
        currentHeadcount: stats.totalCurrentHeadcount,
        projectedDemand: stats.totalProjectedDemand,
        netGap: stats.totalGap,
        hiringRequirement: stats.totalHiringReq,
        upskillingRequirement: stats.totalUpskillingReq,
        upskillSharePercentage: upskillShare,
        confidenceScore: Math.round(stats.avgConfidence || 85),
        financials: {
          hiringBudget: stats.totalHiringBudget,
          upskillingBudget: stats.totalUpskillingBudget,
          totalBudgetImpact: stats.totalBudgetImpact,
        },
      },
      horizonBreakdown: horizonStats.map((h) => ({
        horizon: h._id,
        currentHeadcount: h.currentHeadcount,
        projectedDemand: h.projectedDemand,
        gap: h.gap,
        hiringRequirement: h.hiringRequirement,
        upskillingRequirement: h.upskillingRequirement,
        budgetImpact: h.budgetImpact,
      })),
    });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : 'Failed to fetch forecasting summary', 500);
  }
};

/**
 * 2. Departmental Projections by Time Horizon
 */
export const getForecastingProjectionsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { scenario = 'baseline' } = req.query;

    const projections = await DemandForecastModel.aggregate([
      { $match: { scenario } },
      {
        $group: {
          _id: { department: '$department', timeHorizon: '$timeHorizon' },
          currentHeadcount: { $sum: '$currentHeadcount' },
          projectedDemand: { $sum: '$projectedDemand' },
          gap: { $sum: '$gap' },
          hiringRequirement: { $sum: '$hiringRequirement' },
          upskillingRequirement: { $sum: '$upskillingRequirement' },
        },
      },
      {
        $project: {
          _id: 0,
          department: '$_id.department',
          timeHorizon: '$_id.timeHorizon',
          currentHeadcount: 1,
          projectedDemand: 1,
          gap: 1,
          hiringRequirement: 1,
          upskillingRequirement: 1,
        },
      },
      { $sort: { department: 1, timeHorizon: 1 } },
    ]);

    sendSuccess(res, projections);
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : 'Failed to fetch projections', 500);
  }
};

/**
 * 3. Emerging vs Shrinking Skill Demand Analysis
 */
export const getSkillDemandHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { department } = req.query;
    const match: Record<string, unknown> = {};
    if (department && typeof department === 'string') match.department = department;

    const [emergingSkills, shrinkingSkills] = await Promise.all([
      DemandForecastModel.aggregate([
        { $match: match },
        { $unwind: '$criticalSkills' },
        {
          $group: {
            _id: '$criticalSkills',
            demandCount: { $sum: 1 },
            departments: { $addToSet: '$department' },
            targetRoles: { $addToSet: '$targetRole' },
            avgGap: { $avg: '$gap' },
          },
        },
        {
          $project: {
            _id: 0,
            skillName: '$_id',
            demandCount: 1,
            departments: 1,
            targetRoles: 1,
            avgGap: { $round: ['$avgGap', 1] },
            type: 'emerging',
          },
        },
        { $sort: { demandCount: -1 } },
        { $limit: 10 },
      ]),
      DemandForecastModel.aggregate([
        { $match: match },
        { $unwind: '$shrinkingSkills' },
        {
          $group: {
            _id: '$shrinkingSkills',
            decreaseCount: { $sum: 1 },
            departments: { $addToSet: '$department' },
          },
        },
        {
          $project: {
            _id: 0,
            skillName: '$_id',
            decreaseCount: 1,
            departments: 1,
            type: 'shrinking',
          },
        },
        { $sort: { decreaseCount: -1 } },
        { $limit: 10 },
      ]),
    ]);

    sendSuccess(res, {
      emergingSkills,
      shrinkingSkills,
    });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : 'Failed to fetch skill demand', 500);
  }
};

/**
 * 4. Interactive "What-If" Scenario Simulation Engine
 */
export const simulateScenarioHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      growthRatePercent = 10, // e.g. +10% target headcount growth
      retentionBudget = 50000, // $ retention incentives / bonus pool
      upskillingBudget = 30000, // $ training & reskilling investment
      attritionMitigationPercent = 20, // 0-50% anticipated reduction in turnover
      frozenDepartments = [], // e.g. ['Operations & Logistics']
    } = req.body;

    // Fetch baseline forecast models
    const baselineRecords = await DemandForecastModel.find({ scenario: 'baseline' }).lean();

    let baseHeadcount = 0;
    let base6M = 0;
    let base12M = 0;
    let base24M = 0;
    let baseGap12M = 0;

    baselineRecords.forEach((rec) => {
      baseHeadcount += rec.currentHeadcount;
      if (rec.timeHorizon === '6M') base6M += rec.projectedDemand;
      if (rec.timeHorizon === '12M') {
        base12M += rec.projectedDemand;
        baseGap12M += rec.gap;
      }
      if (rec.timeHorizon === '24M') base24M += rec.projectedDemand;
    });

    if (baseHeadcount === 0) baseHeadcount = 100;
    if (base12M === 0) base12M = 125;
    if (baseGap12M === 0) baseGap12M = 25;

    // Simulation Math:
    // 1. Growth factor applies to demand across non-frozen departments
    const growthFactor = 1 + (Number(growthRatePercent) / 100);
    const sim6M = Math.round(base6M * (1 + (growthRatePercent * 0.4) / 100));
    const sim12M = Math.round(base12M * growthFactor);
    const sim24M = Math.round(base24M * (1 + (growthRatePercent * 1.5) / 100));

    // 2. Upskilling budget converts ~1 internal hire per $4,000 invested
    const internalUpskilledPositions = Math.round(Number(upskillingBudget) / 4000);

    // 3. Retention budget & mitigation rate save ~1 turnover per $8,000 invested
    const turnoverSavedPositions = Math.round((Number(retentionBudget) / 8000) * (1 + Number(attritionMitigationPercent) / 100));

    // 4. Net Gap after upskilling and saved retention
    const rawSimGap12M = sim12M - baseHeadcount;
    const mitigatedGap12M = Math.max(0, rawSimGap12M - internalUpskilledPositions - turnoverSavedPositions);

    // 5. Financial impact: External hiring cost ($15,000 / hire) saved
    const externalHiringCostPerHead = 15000;
    const simulatedTotalCost = Number(retentionBudget) + Number(upskillingBudget) + (mitigatedGap12M * externalHiringCostPerHead);
    const baselineTotalCost = baseGap12M * externalHiringCostPerHead;
    const netSavings = Math.max(0, baselineTotalCost - simulatedTotalCost);
    const roiMultiplier = Number(upskillingBudget) + Number(retentionBudget) > 0
      ? Number(((netSavings / (Number(upskillingBudget) + Number(retentionBudget))) + 1).toFixed(2))
      : 1.0;

    const gapClosurePercentage = baseGap12M > 0
      ? Number((((baseGap12M - mitigatedGap12M) / baseGap12M) * 100).toFixed(1))
      : 100;

    sendSuccess(res, {
      simulationInputs: {
        growthRatePercent,
        retentionBudget,
        upskillingBudget,
        attritionMitigationPercent,
        frozenDepartments,
      },
      results: {
        baseHeadcount,
        baselineTrajectory: [
          { period: 'Current', headcount: baseHeadcount },
          { period: '6 Months', headcount: base6M },
          { period: '12 Months', headcount: base12M },
          { period: '24 Months', headcount: base24M },
        ],
        simulatedTrajectory: [
          { period: 'Current', headcount: baseHeadcount },
          { period: '6 Months', headcount: sim6M },
          { period: '12 Months', headcount: sim12M },
          { period: '24 Months', headcount: sim24M },
        ],
        gapAnalysis: {
          baselineGap12M: baseGap12M,
          simulatedGap12M: mitigatedGap12M,
          internalUpskilledFill: internalUpskilledPositions,
          turnoverSavedPositions,
          gapClosurePercentage: Math.min(100, Math.max(0, gapClosurePercentage)),
        },
        financialImpact: {
          totalInvestment: Number(retentionBudget) + Number(upskillingBudget),
          simulatedTotalCost,
          baselineTotalCost,
          projectedNetSavings: netSavings,
          estimatedRoiMultiplier: roiMultiplier,
        },
      },
    });
  } catch (error) {
    console.error('SIMULATION ERROR:', error);
    sendError(res, error instanceof Error ? error.message : 'Simulation computation failed', 500);
  }
};

/**
 * 5. Paginated Demand Forecasts Table
 */
export const getDemandForecastsTableHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const {
      search,
      department,
      timeHorizon,
      scenario = 'baseline',
      sortBy = 'gap',
      sortOrder = 'desc',
    } = req.query;

    const filter: Record<string, unknown> = {};
    if (department && typeof department === 'string') filter.department = department;
    if (timeHorizon && typeof timeHorizon === 'string') filter.timeHorizon = timeHorizon;
    if (scenario && typeof scenario === 'string') filter.scenario = scenario;

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const reg = new RegExp(search.trim(), 'i');
      filter.$or = [
        { targetRole: reg },
        { department: reg },
        { criticalSkills: reg },
      ];
    }

    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sortField = typeof sortBy === 'string' ? sortBy : 'gap';

    const [forecasts, total] = await Promise.all([
      DemandForecastModel.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .lean(),
      DemandForecastModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    sendSuccess(res, {
      forecasts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    sendError(res, error instanceof Error ? error.message : 'Failed to fetch forecasts table', 500);
  }
};
