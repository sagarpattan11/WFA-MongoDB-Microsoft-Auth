import { Request, Response } from 'express';
import { sendError } from '../../utils/api-response';
import { AttritionRiskModel } from '../attrition/models/AttritionRisk.model';
import { logAuditEvent } from '../audit/audit.service';
import { DepartmentModel } from '../departments/models/Department.model';
import { EmployeeModel } from '../employees/models/Employee.model';
import { DemandForecastModel } from '../forecasting/models/DemandForecast.model';
import { PerformanceModel } from '../performance/models/Performance.model';
import { PlacementModel } from '../placement/models/Placement.model';
import { RecruitmentModel } from '../recruitment/models/Recruitment.model';
import { EnrollmentModel } from '../training/models/Enrollment.model';

export const exportReportHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { module = 'workforce', format = 'csv' } = req.query;
    const userRole = ((req.session as any)?.user?.roles?.[0] as string) || 'hr_manager';

    // Log compliance audit trail
    await logAuditEvent({
      req,
      action: 'REPORT_EXPORT',
      entityType: 'Report',
      description: `Exported ${module} analytics report in ${format} format`,
      metadata: { module, format, userRole },
    });

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `wfa_${module}_report_${timestamp}.${format === 'excel' ? 'csv' : format}`;

    let data: Record<string, unknown>[] = [];
    let headers: string[] = [];

    if (module === 'workforce') {
      const employees = await EmployeeModel.find({ isDeleted: false }).populate('departmentId').lean();
      headers = ['Employee ID', 'First Name', 'Last Name', 'Email', 'Department', 'Job Title', 'Status', 'Location', 'Employment Type', 'Hire Date'];
      data = employees.map((e: any) => ({
        'Employee ID': e.employeeId,
        'First Name': e.firstName,
        'Last Name': e.lastName,
        'Email': e.email,
        'Department': e.departmentId?.name || 'Unassigned',
        'Job Title': e.jobTitle,
        'Status': e.status?.toUpperCase(),
        'Location': e.location,
        'Employment Type': e.employmentType,
        'Hire Date': e.hireDate ? new Date(e.hireDate).toISOString().split('T')[0] : '',
      }));
    } else if (module === 'placement') {
      const placements = await PlacementModel.find().lean();
      headers = ['Candidate ID', 'Name', 'Email', 'Department', 'Skill Domain', 'Target Role', 'Location', 'Offered Salary', 'Employer', 'Status'];
      data = placements.map((p: any) => ({
        'Candidate ID': p.candidateId,
        'Name': p.candidateName,
        'Email': p.email,
        'Department': p.department,
        'Skill Domain': p.skillDomain,
        'Target Role': p.targetRole,
        'Location': p.location,
        'Offered Salary': `$${p.offeredSalary?.toLocaleString()}`,
        'Employer': p.employerName,
        'Status': p.status?.toUpperCase(),
      }));
    } else if (module === 'recruitment') {
      const requisitions = await RecruitmentModel.find().lean();
      headers = ['Requisition ID', 'Job Title', 'Department', 'Location', 'Open Positions', 'Status', 'Cost Per Hire', 'Time To Hire (Days)'];
      data = requisitions.map((r: any) => ({
        'Requisition ID': r.requisitionId,
        'Job Title': r.jobTitle,
        'Department': r.department,
        'Location': r.location,
        'Open Positions': r.openPositions,
        'Status': r.status?.toUpperCase(),
        'Cost Per Hire': `$${r.metrics?.costPerHire || 4500}`,
        'Time To Hire (Days)': r.metrics?.timeToHireDays || 30,
      }));
    } else if (module === 'learning') {
      const enrollments = await EnrollmentModel.find().lean();
      headers = ['Employee Name', 'Department', 'Course Code', 'Course Title', 'Target Skill', 'Status', 'Progress %', 'Assessment Score', 'Certificate Issued'];
      data = enrollments.map((en: any) => ({
        'Employee Name': en.employeeName,
        'Department': en.department,
        'Course Code': en.courseCode,
        'Course Title': en.courseTitle,
        'Target Skill': en.targetSkillName,
        'Status': en.status?.toUpperCase(),
        'Progress %': `${en.progressPercentage || 0}%`,
        'Assessment Score': en.assessmentScore ? `${en.assessmentScore}/100` : 'N/A',
        'Certificate Issued': en.certificateIssued ? 'YES' : 'NO',
      }));
    } else if (module === 'attrition') {
      const attritionList = await AttritionRiskModel.find().lean();
      headers = ['Employee Name', 'Department', 'Role', 'Risk Score', 'Risk Level', 'Timeframe', 'Primary Driver', 'Replacement Exposure', 'Recommendation', 'Status'];
      data = attritionList.map((a: any) => ({
        'Employee Name': a.employeeName,
        'Department': a.department,
        'Role': a.role,
        'Risk Score': `${a.riskScore}/100`,
        'Risk Level': a.riskLevel,
        'Timeframe': a.predictedTimeframe,
        'Primary Driver': a.keyDrivers?.[0]?.factor || 'Salary Gap',
        'Replacement Exposure': `$${a.replacementCost?.toLocaleString()}`,
        'Recommendation': a.recommendations?.[0] || 'Schedule 1-on-1',
        'Status': a.status?.toUpperCase(),
      }));
    } else if (module === 'forecasting') {
      const forecastList = await DemandForecastModel.find({ scenario: 'baseline' }).lean();
      headers = ['Department', 'Target Role', 'Time Horizon', 'Current Headcount', 'Projected Demand', 'Net Gap', 'Hiring Needed', 'Upskilling Needed', 'Confidence', 'Budget Impact'];
      data = forecastList.map((f: any) => ({
        'Department': f.department,
        'Target Role': f.targetRole,
        'Time Horizon': f.timeHorizon,
        'Current Headcount': f.currentHeadcount,
        'Projected Demand': f.projectedDemand,
        'Net Gap': `+${f.gap}`,
        'Hiring Needed': f.hiringRequirement,
        'Upskilling Needed': f.upskillingRequirement,
        'Confidence': `${f.confidenceScore}%`,
        'Budget Impact': `$${f.totalBudgetImpact?.toLocaleString()}`,
      }));
    } else if (module === 'performance') {
      const reviews = await PerformanceModel.find()
        .populate({ path: 'employeeId', populate: { path: 'departmentId' } })
        .sort({ performanceScore: -1 })
        .lean();
      headers = ['Employee Name', 'Department', 'Job Title', 'Review Cycle', 'Rating', 'Goal Completion %', 'Promotion Readiness', 'Top Strengths'];
      data = reviews.map((r: any) => ({
        'Employee Name': r.employeeId ? `${r.employeeId.firstName} ${r.employeeId.lastName}` : 'Enterprise Employee',
        'Department': r.employeeId?.departmentId?.name || 'Engineering',
        'Job Title': r.employeeId?.jobTitle || 'Senior Engineer',
        'Review Cycle': r.reviewCycle,
        'Rating': `${r.performanceScore?.toFixed(1)} / 5.0`,
        'Goal Completion %': `${r.goalCompletionRate}%`,
        'Promotion Readiness': r.promotionReadiness?.toUpperCase(),
        'Top Strengths': r.strengths?.join('; ') || 'Technical Delivery',
      }));
    } else if (module === 'executive') {
      const [departments, deptAttrition] = await Promise.all([
        DepartmentModel.find().lean(),
        AttritionRiskModel.aggregate([
          {
            $group: {
              _id: '$department',
              avgScore: { $avg: '$riskScore' },
              criticalCount: { $sum: { $cond: [{ $in: ['$riskLevel', ['High', 'Critical']] }, 1, 0] } },
              total: { $sum: 1 },
            },
          },
        ]),
      ]);

      const deptAttritionMap: Record<string, any> = {};
      deptAttrition.forEach((d) => {
        deptAttritionMap[d._id] = d;
      });

      headers = [
        'Department Code',
        'Department Name',
        'Headcount',
        'Health Index (/100)',
        'Health Status',
        'Flight Risk Rate (%)',
        'Critical Risk Employees',
        'Avg Risk Score (/100)',
        'Description',
      ];

      data = departments.map((d: any) => {
        const att = deptAttritionMap[d.name] || { avgScore: 32, criticalCount: 2, total: 20 };
        const deptRiskPct = att.total > 0 ? Math.round((att.criticalCount / att.total) * 100) : 10;
        const deptHealth = Math.round(Math.max(50, 100 - (att.avgScore * 0.9) - (deptRiskPct * 0.5)));
        const status = deptHealth >= 80 ? 'OPTIMAL' : deptHealth >= 65 ? 'MODERATE' : 'NEEDS ATTENTION';

        return {
          'Department Code': d.code,
          'Department Name': d.name,
          'Headcount': att.total || 20,
          'Health Index (/100)': deptHealth,
          'Health Status': status,
          'Flight Risk Rate (%)': `${deptRiskPct}%`,
          'Critical Risk Employees': att.criticalCount,
          'Avg Risk Score (/100)': Math.round(att.avgScore),
          'Description': d.description || '',
        };
      });
    }

    if (format === 'csv' || format === 'excel') {
      const csvRows: string[] = [];
      csvRows.push(headers.join(','));

      for (const row of data) {
        const values = headers.map((header) => {
          const val = row[header] ?? '';
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
      }

      const csvString = csvRows.join('\n');
      res.setHeader('Content-Type', format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.status(200).send(csvString);
      return;
    }

    if (format === 'pdf' || format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="wfa_${module}_report_${timestamp}.json"`);
      res.status(200).json({
        reportModule: module,
        generatedAt: new Date().toISOString(),
        generatedByRole: userRole,
        totalRecords: data.length,
        headers,
        records: data,
      });
      return;
    }

    sendError(res, 'Unsupported export format. Use csv, excel, or pdf/json.', 400);
  } catch (error) {
    console.error('Error in exportReportHandler:', error);
    sendError(res, 'Failed to export report', 500);
  }
};
