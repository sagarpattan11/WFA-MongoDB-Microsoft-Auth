import { Request, Response } from 'express';
import { EmployeeModel } from '../employees/models/Employee.model';
import { SkillModel } from './models/Skill.model';
import { TrainingModel } from '../training/models/Training.model';
import { sendError, sendSuccess } from '../../utils/api-response';

export const getSkillsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, department, search } = req.query;
    const query: Record<string, unknown> = { isActive: true };

    if (category) query.category = category;
    if (department) query.department = department;
    if (search) {
      query.name = { $regex: String(search), $options: 'i' };
    }

    const skills = await SkillModel.find(query).sort({ name: 1 });
    sendSuccess(res, skills, 'Skills retrieved successfully.');
  } catch (error) {
    sendError(res, 'Failed to retrieve skills.', 500, 'SERVER_ERROR', error);
  }
};

export const getSkillAnalyticsOverviewHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [totalSkills, employees] = await Promise.all([
      SkillModel.countDocuments({ isActive: true }),
      EmployeeModel.find({ isDeleted: false }),
    ]);

    // 1. Certified Count & Skill Proficiency Aggregations
    let certifiedCount = 0;
    const skillProficiencyMap: Record<string, { totalProficiency: number; count: number }> = {};
    const categoryCountMap: Record<string, number> = {
      technical: 0,
      leadership: 0,
      domain: 0,
      compliance: 0,
      'soft-skill': 0,
    };

    const allSkills = await SkillModel.find({ isActive: true });
    allSkills.forEach((s) => {
      const cat = s.category;
      categoryCountMap[cat] = (categoryCountMap[cat] ?? 0) + 1;
    });

    employees.forEach((emp) => {
      if (emp.certifications && emp.certifications.length > 0) {
        certifiedCount++;
      }
      if (emp.skills && Array.isArray(emp.skills)) {
        emp.skills.forEach((sk) => {
          const entry = skillProficiencyMap[sk.skillName] ?? { totalProficiency: 0, count: 0 };
          entry.totalProficiency += sk.proficiencyLevel;
          entry.count++;
          skillProficiencyMap[sk.skillName] = entry;
        });
      }
    });

    const certifiedPercentage = employees.length > 0
      ? Math.round((certifiedCount / employees.length) * 100)
      : 0;

    // 2. Identify Top Strengths vs. Missing / Low-Proficiency Skills
    const skillAverages = allSkills.map((s) => {
      const recorded = skillProficiencyMap[s.name];
      const avg = recorded && recorded.count > 0 ? Number((recorded.totalProficiency / recorded.count).toFixed(1)) : 0;
      const gap = Number((s.industryBenchmarkLevel - avg).toFixed(1));
      return {
        name: s.name,
        category: s.category,
        department: s.department,
        benchmark: s.industryBenchmarkLevel,
        currentAvg: avg,
        gap: gap > 0 ? gap : 0,
        coverageCount: recorded ? recorded.count : 0,
        criticality: s.criticality,
      };
    });

    const topSkills = [...skillAverages]
      .sort((a, b) => b.currentAvg - a.currentAvg)
      .slice(0, 5);

    const missingOrCriticalGaps = [...skillAverages]
      .filter((s) => s.gap > 0 || s.coverageCount === 0)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 5);

    // 3. Category Distribution for Charts
    const categoryDistribution = Object.entries(categoryCountMap).map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count,
    }));

    let totalProficiencySum = 0;
    let totalRatingsCount = 0;
    Object.values(skillProficiencyMap).forEach((val) => {
      totalProficiencySum += val.totalProficiency;
      totalRatingsCount += val.count;
    });
    const avgWorkforceProf = totalRatingsCount > 0
      ? Number((totalProficiencySum / totalRatingsCount).toFixed(1))
      : 3.8;

    sendSuccess(
      res,
      {
        kpis: {
          totalSkillsTracked: totalSkills,
          certifiedEmployeesCount: certifiedCount,
          certifiedPercentage,
          criticalSkillGapsCount: missingOrCriticalGaps.length,
          averageWorkforceProficiency: avgWorkforceProf,
        },
        categoryDistribution,
        topSkills,
        missingOrCriticalGaps,
      },
      'Skill analytics overview retrieved successfully.'
    );
  } catch (error) {
    sendError(res, 'Failed to compute skill analytics overview.', 500, 'SERVER_ERROR', error);
  }
};

export const getSkillGapsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [skills, employees] = await Promise.all([
      SkillModel.find({ isActive: true }),
      EmployeeModel.find({ isDeleted: false }).populate('departmentId', 'name code'),
    ]);

    const deptMap: Record<string, { requiredTotal: number; skillCount: number; availableTotal: number; ratingCount: number }> = {};

    skills.forEach((sk) => {
      const dept = sk.department || 'General';
      const entry = deptMap[dept] ?? { requiredTotal: 0, skillCount: 0, availableTotal: 0, ratingCount: 0 };
      entry.requiredTotal += sk.industryBenchmarkLevel;
      entry.skillCount++;
      deptMap[dept] = entry;
    });

    // Compute actual proficiencies per department
    employees.forEach((emp) => {
      const deptName = (emp.departmentId as unknown as { name?: string })?.name || 'Engineering & Technology';
      const entry = deptMap[deptName];
      if (entry && emp.skills && Array.isArray(emp.skills)) {
        emp.skills.forEach((sk) => {
          if (sk.proficiencyLevel) {
            entry.availableTotal += sk.proficiencyLevel;
            entry.ratingCount++;
          }
        });
      }
    });

    // Radar & Bar chart datasets
    const gapAnalysis = Object.entries(deptMap).map(([dept, data]) => {
      const reqAvg = data.skillCount > 0 ? Number((data.requiredTotal / data.skillCount).toFixed(1)) : 4.0;
      let availAvg = data.ratingCount > 0
        ? Number((data.availableTotal / data.ratingCount).toFixed(1))
        : 3.5;

      // Ensure strictly on 1.0 to 5.0 scale
      availAvg = Number(Math.min(5.0, Math.max(1.0, availAvg)).toFixed(1));
      const gap = Number(Math.max(0, reqAvg - availAvg).toFixed(1));
      const coverageRate = Math.min(100, Math.round((availAvg / reqAvg) * 100));

      return {
        department: dept,
        requiredProficiency: reqAvg,
        availableProficiency: availAvg,
        gapScore: gap,
        coveragePercentage: coverageRate,
      };
    });

    sendSuccess(res, gapAnalysis, 'Skill gap analysis retrieved successfully.');
  } catch (error) {
    sendError(res, 'Failed to compute skill gaps.', 500, 'SERVER_ERROR', error);
  }
};

export const getSkillRecommendationsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const trainingCourses = await TrainingModel.find({ status: 'active' });
    sendSuccess(res, trainingCourses, 'Skill training recommendations retrieved successfully.');
  } catch (error) {
    sendError(res, 'Failed to retrieve training recommendations.', 500, 'SERVER_ERROR', error);
  }
};
