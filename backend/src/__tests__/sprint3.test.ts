import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../app';
import { AttritionRiskModel } from '../modules/attrition/models/AttritionRisk.model';
import { AuditLogModel } from '../modules/audit/models/AuditLog.model';
import { DepartmentModel } from '../modules/departments/models/Department.model';
import { EmployeeModel } from '../modules/employees/models/Employee.model';
import { WorkforceAlertModel } from '../modules/executive/models/WorkforceAlert.model';
import { DemandForecastModel } from '../modules/forecasting/models/DemandForecast.model';
import { LocationModel } from '../modules/locations/models/Location.model';
import { PerformanceModel } from '../modules/performance/models/Performance.model';
import { PlacementModel } from '../modules/placement/models/Placement.model';
import { CandidateApplicationModel } from '../modules/recruitment/models/CandidateApplication.model';
import { SkillModel } from '../modules/skills/models/Skill.model';
import { EnrollmentModel } from '../modules/training/models/Enrollment.model';

describe('Sprint 3: Attrition, Forecasting, What-If Simulation & Executive Reporting', () => {
  const app = createApp();

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(AuditLogModel, 'create').mockResolvedValue({} as any);
  });

  describe('Attrition & Flight Risk Analytics', () => {
    it('GET /api/v1/attrition/summary should return financial exposure and risk breakdown', async () => {
      vi.spyOn(AttritionRiskModel, 'countDocuments').mockResolvedValue(100 as any);
      vi.spyOn(AttritionRiskModel, 'aggregate').mockImplementation(async (pipeline: any) => {
        const firstStage = pipeline[1]?.$group || pipeline[0]?.$group;
        if (firstStage?.avgRiskScore) {
          return [{ avgRiskScore: 34.5, avgTenure: 28.2, avgPerformance: 3.8 }];
        }
        if (firstStage?._id === '$riskLevel') {
          return [
            { _id: 'Low', count: 50 },
            { _id: 'Medium', count: 30 },
            { _id: 'High', count: 15 },
            { _id: 'Critical', count: 5 },
          ];
        }
        if (firstStage?.totalReplacementCost) {
          return [{ totalReplacementCost: 450000, totalRetentionCost: 80000, totalRetentionRoi: 370000 }];
        }
        if (firstStage?._id === '$department') {
          return [
            { _id: 'Engineering', avgRiskScore: 42.1, totalEmployees: 40, criticalRiskCount: 8, replacementExposure: 200000 },
          ];
        }
        return [];
      });

      const res = await request(app).get('/api/v1/attrition/summary');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalAssessed', 100);
      expect(res.body.data).toHaveProperty('avgRiskScore', 34.5);
      expect(res.body.data).toHaveProperty('flightRiskPercentage');
      expect(res.body.data).toHaveProperty('countsByLevel');
      expect(res.body.data).toHaveProperty('financials');
      expect(res.body.data.financials).toHaveProperty('totalReplacementExposure', 450000);
      expect(res.body.data.financials).toHaveProperty('totalRetentionInvestment', 80000);
      expect(res.body.data.financials).toHaveProperty('estimatedNetSavings', 370000);
      expect(Array.isArray(res.body.data.departmentBreakdown)).toBe(true);
    });

    it('GET /api/v1/attrition/risk-matrix should return department x role cross-tabulation', async () => {
      vi.spyOn(AttritionRiskModel, 'aggregate').mockResolvedValue([
        {
          department: 'Engineering',
          role: 'Senior Full Stack Developer',
          totalCount: 12,
          avgRiskScore: 38.2,
          lowCount: 6,
          mediumCount: 4,
          highCount: 2,
          criticalCount: 0,
          replacementExposure: 75000,
        },
      ] as any);

      const res = await request(app).get('/api/v1/attrition/risk-matrix');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      if (res.body.data.length > 0) {
        expect(res.body.data[0]).toHaveProperty('department', 'Engineering');
        expect(res.body.data[0]).toHaveProperty('role', 'Senior Full Stack Developer');
        expect(res.body.data[0]).toHaveProperty('avgRiskScore', 38.2);
      }
    });

    it('GET /api/v1/attrition/drivers should aggregate top attrition factors', async () => {
      vi.spyOn(AttritionRiskModel, 'aggregate').mockResolvedValue([
        {
          factor: 'Market Salary Parity Gap',
          occurrences: 32,
          avgWeight: 84.5,
          highImpactCount: 24,
          sampleDescription: 'Compensation lag vs industry P75',
        },
      ] as any);

      const res = await request(app).get('/api/v1/attrition/drivers');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      if (res.body.data.length > 0) {
        expect(res.body.data[0]).toHaveProperty('factor');
        expect(res.body.data[0]).toHaveProperty('occurrences', 32);
        expect(res.body.data[0]).toHaveProperty('avgWeight', 84.5);
      }
    });

    it('GET /api/v1/attrition/employees should return paginated employee flight risk records', async () => {
      vi.spyOn(AttritionRiskModel, 'countDocuments').mockResolvedValue(100 as any);
      vi.spyOn(AttritionRiskModel, 'find').mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([
          {
            _id: 'risk_1',
            employeeName: 'Aarav Mehta',
            department: 'Engineering',
            role: 'Lead Architect',
            riskScore: 78,
            riskLevel: 'High',
            status: 'Active',
          },
        ]),
      } as any);

      const res = await request(app).get('/api/v1/attrition/employees?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.employees)).toBe(true);
      expect(res.body.data.pagination).toHaveProperty('page', 1);
      expect(res.body.data.pagination).toHaveProperty('limit', 10);
      expect(res.body.data.pagination).toHaveProperty('total', 100);
    });
  });

  describe('Workforce Demand Forecasting & What-If Simulation', () => {
    it('GET /api/v1/forecasting/summary should return talent gap and budget projections', async () => {
      vi.spyOn(DemandForecastModel, 'aggregate').mockImplementation(async (pipeline: any) => {
        const group = pipeline[1]?.$group;
        if (group?._id === null) {
          return [
            {
              totalCurrentHeadcount: 100,
              totalProjectedDemand: 135,
              totalGap: 35,
              totalHiringReq: 25,
              totalUpskillingReq: 10,
              avgConfidence: 88,
              totalHiringBudget: 250000,
              totalUpskillingBudget: 170000,
              totalBudgetImpact: 420000,
            },
          ];
        }
        return [
          {
            _id: '12M',
            currentHeadcount: 100,
            projectedDemand: 135,
            gap: 35,
            hiringRequirement: 25,
            upskillingRequirement: 10,
            budgetImpact: 420000,
          },
        ];
      });

      const res = await request(app).get('/api/v1/forecasting/summary?scenario=baseline&timeHorizon=12M');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.summary).toHaveProperty('currentHeadcount', 100);
      expect(res.body.data.summary).toHaveProperty('projectedDemand', 135);
      expect(res.body.data.summary).toHaveProperty('netGap', 35);
      expect(res.body.data.summary).toHaveProperty('upskillSharePercentage');
      expect(Array.isArray(res.body.data.horizonBreakdown)).toBe(true);
    });

    it('GET /api/v1/forecasting/projections should return horizon breakdowns by department', async () => {
      vi.spyOn(DemandForecastModel, 'aggregate').mockResolvedValue([
        {
          department: 'Engineering',
          currentHeadcount: 40,
          demand6M: 45,
          demand12M: 52,
          demand24M: 65,
        },
      ] as any);

      const res = await request(app).get('/api/v1/forecasting/projections?scenario=baseline');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/v1/forecasting/skill-demand should return emerging and shrinking skills', async () => {
      vi.spyOn(DemandForecastModel, 'aggregate').mockImplementation(async (pipeline: any) => {
        const match = pipeline[0]?.$match;
        if (match?.trend === 'emerging') {
          return [{ skillName: 'Kubernetes Orchestration', growthPercentage: 45.0, count: 5 }];
        }
        return [{ skillName: 'Legacy Monolith Maintenance', growthPercentage: -30.0, count: 3 }];
      });

      const res = await request(app).get('/api/v1/forecasting/skill-demand');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('emergingSkills');
      expect(res.body.data).toHaveProperty('shrinkingSkills');
    });

    it('POST /api/v1/forecasting/simulate should execute dynamic scenario simulation', async () => {
      vi.spyOn(DemandForecastModel, 'find').mockReturnValue({
        lean: vi.fn().mockResolvedValue([
          {
            currentHeadcount: 40,
            timeHorizon: '12M',
            projectedDemand: 52,
            gap: 12,
          },
        ]),
      } as any);

      const res = await request(app)
        .post('/api/v1/forecasting/simulate')
        .send({
          growthRatePercent: 15,
          retentionBudget: 60000,
          upskillingBudget: 40000,
          attritionMitigationPercent: 25,
          frozenDepartments: [],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.results).toHaveProperty('baselineTrajectory');
      expect(res.body.data.results).toHaveProperty('simulatedTrajectory');
      expect(res.body.data.results).toHaveProperty('gapAnalysis');
      expect(res.body.data.results).toHaveProperty('financialImpact');
      expect(res.body.data.results.financialImpact).toHaveProperty('projectedNetSavings');
    });
  });

  describe('Executive Cockpit & Real-time Alerts', () => {
    it('GET /api/v1/executive/overview should return multi-module consolidated health index', async () => {
      vi.spyOn(EmployeeModel, 'countDocuments').mockResolvedValue(100 as any);
      vi.spyOn(DepartmentModel, 'countDocuments').mockResolvedValue(8 as any);
      vi.spyOn(LocationModel, 'countDocuments').mockResolvedValue(6 as any);
      vi.spyOn(SkillModel, 'countDocuments').mockResolvedValue(25 as any);
      vi.spyOn(PlacementModel, 'aggregate').mockResolvedValue([{ totalCandidates: 35, placedCount: 30, avgPlacementDays: 14 }] as any);
      vi.spyOn(CandidateApplicationModel, 'aggregate').mockResolvedValue([{ totalApplications: 60, hiredCount: 15, avgTimeToHire: 21 }] as any);
      vi.spyOn(AttritionRiskModel, 'aggregate').mockResolvedValue([{ totalAssessed: 100, avgRiskScore: 32.5, highCriticalCount: 10, totalReplacementCost: 200000, totalRetentionRoi: 150000 }] as any);
      vi.spyOn(DemandForecastModel, 'aggregate').mockResolvedValue([{ totalProjectedDemand: 135, totalGap: 35, totalHiringReq: 20, totalUpskillingReq: 15, avgConfidence: 85 }] as any);
      vi.spyOn(EnrollmentModel, 'aggregate').mockResolvedValue([{ totalEnrollments: 75, completedCount: 65, avgSkillGain: 1.8, avgFeedback: 4.5 }] as any);
      vi.spyOn(WorkforceAlertModel, 'aggregate').mockResolvedValue([{ totalAlerts: 2, unreadCount: 1, criticalCount: 1 }] as any);
      vi.spyOn(DepartmentModel, 'find').mockReturnValue({
        lean: vi.fn().mockResolvedValue([
          {
            _id: 'dept_1',
            name: 'Engineering',
            employeeCount: 40,
            activeTeams: 4,
            budgetAllocated: 500000,
            budgetSpent: 350000,
          },
        ]),
      } as any);

      const res = await request(app).get('/api/v1/executive/overview');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('overallExecutiveIndex');
      expect(Array.isArray(res.body.data.healthDimensions)).toBe(true);
      expect(res.body.data.kpis).toHaveProperty('workforce');
      expect(res.body.data.kpis).toHaveProperty('skills');
      expect(res.body.data.kpis).toHaveProperty('recruitmentAndPlacement');
      expect(res.body.data.kpis).toHaveProperty('attrition');
      expect(res.body.data.kpis).toHaveProperty('forecasting');
      expect(res.body.data.kpis).toHaveProperty('alerts');
      expect(Array.isArray(res.body.data.departmentScorecards)).toBe(true);
    });

    it('GET /api/v1/executive/alerts should return active workforce alerts', async () => {
      vi.spyOn(WorkforceAlertModel, 'find').mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([
          {
            _id: 'alert_1',
            title: 'Critical Retention Risk in Data Engineering',
            severity: 'critical',
            status: 'active',
          },
        ]),
      } as any);
      vi.spyOn(WorkforceAlertModel, 'countDocuments').mockResolvedValue(1 as any);

      const res = await request(app).get('/api/v1/executive/alerts');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.alerts)).toBe(true);
      expect(res.body.data).toHaveProperty('unreadCount');
      expect(res.body.data).toHaveProperty('criticalCount');
    });
  });

  describe('Explainable AI Model Evaluation', () => {
    it('GET /api/v1/attrition/model-metrics should return XGBoost and SHAP accuracy report', async () => {
      vi.spyOn(AttritionRiskModel, 'countDocuments').mockResolvedValue(100 as any);

      const res = await request(app).get('/api/v1/attrition/model-metrics');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('modelMeta');
      expect(res.body.data).toHaveProperty('evaluationMetrics');
      expect(res.body.data.evaluationMetrics).toHaveProperty('accuracy');
      expect(res.body.data.evaluationMetrics).toHaveProperty('precision');
      expect(res.body.data.evaluationMetrics).toHaveProperty('recall');
      expect(res.body.data.evaluationMetrics).toHaveProperty('f1Score');
      expect(res.body.data).toHaveProperty('confusionMatrix');
      expect(Array.isArray(res.body.data.shapFeatureImportance)).toBe(true);
    });
  });

  describe('Performance & Productivity Analytics', () => {
    it('GET /api/v1/performance/summary should return quarterly ratings and promotion readiness', async () => {
      vi.spyOn(PerformanceModel, 'countDocuments').mockResolvedValue(100 as any);
      vi.spyOn(PerformanceModel, 'aggregate').mockImplementation(async (pipeline: any) => {
        const group = pipeline[1]?.$group || pipeline[0]?.$group;
        if (group?.avgPerformanceScore) {
          return [{ avgPerformanceScore: 3.82, avgGoalCompletionRate: 87.5 }];
        }
        if (group?._id === '$rating') {
          return [
            { _id: 'Exceeds Expectations', count: 35 },
            { _id: 'Meets Expectations', count: 50 },
            { _id: 'Needs Improvement', count: 15 },
          ];
        }
        if (group?._id === '$department') {
          return [
            { _id: 'Engineering', avgRating: 3.9, avgGoalCompletion: 88.0, totalEvaluated: 40, readyForPromotionCount: 8 },
          ];
        }
        return [];
      });

      const res = await request(app).get('/api/v1/performance/summary?reviewCycle=2026-Q2');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('summary');
      expect(res.body.data.summary).toHaveProperty('totalEvaluated');
      expect(res.body.data.summary).toHaveProperty('avgPerformanceScore');
      expect(res.body.data.summary).toHaveProperty('avgGoalCompletionRate');
      expect(res.body.data).toHaveProperty('promotionReadiness');
      expect(Array.isArray(res.body.data.departmentComparison)).toBe(true);
    });

    it('GET /api/v1/performance/trends should return cycle-by-cycle performance progression', async () => {
      vi.spyOn(PerformanceModel, 'aggregate').mockResolvedValue([
        {
          cycle: '2026-Q1',
          avgPerformanceScore: 3.75,
          avgGoalCompletionRate: 85.0,
          topPerformersCount: 30,
        },
        {
          cycle: '2026-Q2',
          avgPerformanceScore: 3.82,
          avgGoalCompletionRate: 87.5,
          topPerformersCount: 35,
        },
      ] as any);

      const res = await request(app).get('/api/v1/performance/trends');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/v1/performance/reviews should return paginated review directory', async () => {
      vi.spyOn(PerformanceModel, 'countDocuments').mockResolvedValue(100 as any);
      vi.spyOn(PerformanceModel, 'find').mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([
          {
            _id: 'review_1',
            employeeName: 'Aarav Mehta',
            department: 'Engineering',
            role: 'Lead Architect',
            overallRating: 4.5,
            ratingLabel: 'Exceeds Expectations',
            promotionReadiness: 'Ready Now',
          },
        ]),
      } as any);

      const res = await request(app).get('/api/v1/performance/reviews?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.reviews)).toBe(true);
      expect(res.body.data.pagination).toHaveProperty('page', 1);
      expect(res.body.data.pagination).toHaveProperty('limit', 10);
      expect(res.body.data.pagination).toHaveProperty('total', 100);
    });
  });

  describe('Compliance & Audit Trail', () => {
    it('GET /api/v1/audit-logs should return immutable audit logs with pagination', async () => {
      vi.spyOn(AuditLogModel, 'countDocuments').mockResolvedValue(30 as any);
      vi.spyOn(AuditLogModel, 'find').mockReturnValue({
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([
          {
            _id: 'audit_1',
            action: 'PREDICTION_VIEW',
            actorRole: 'executive',
            entityType: 'AttritionRisk',
            description: 'Accessed employee flight risk roster',
            createdAt: new Date().toISOString(),
          },
        ]),
      } as any);

      const res = await request(app).get('/api/v1/audit-logs?page=1&limit=10');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.logs)).toBe(true);
      expect(res.body.data.pagination).toHaveProperty('page', 1);
      expect(res.body.data.pagination).toHaveProperty('limit', 10);
      expect(res.body.data.pagination).toHaveProperty('total', 30);
    });
  });
});


