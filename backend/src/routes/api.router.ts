import { Router } from 'express';
import { attritionRouter } from '../modules/attrition/attrition.router';
import { auditRouter } from '../modules/audit/audit.router';
import { authRouter } from '../modules/auth/auth.router';
import { dashboardRouter } from '../modules/dashboard/dashboard.router';
import { departmentRouter } from '../modules/departments/department.router';
import { employeeRouter } from '../modules/employees/employee.router';
import { executiveRouter } from '../modules/executive/executive.router';
import { forecastingRouter } from '../modules/forecasting/forecasting.router';
import { locationRouter } from '../modules/locations/location.router';
import { performanceRouter } from '../modules/performance/performance.router';
import { placementRouter } from '../modules/placement/placement.router';
import { recruitmentRouter } from '../modules/recruitment/recruitment.router';
import { reportsRouter } from '../modules/reports/reports.router';
import { roleRouter } from '../modules/roles/role.router';
import { skillRouter } from '../modules/skills/skill.router';
import { teamRouter } from '../modules/teams/team.router';
import { learningRouter } from '../modules/training/learning.router';
import { healthRouter } from './health.router';

const router = Router();

// Health Check
router.use('/health', healthRouter);

// Authentication & Passkeys
router.use('/auth', authRouter);

// Employee Management
router.use('/employees', employeeRouter);

// Departments, Teams, Roles & Locations
router.use('/departments', departmentRouter);
router.use('/teams', teamRouter);
router.use('/roles', roleRouter);
router.use('/locations', locationRouter);

// Skill Analytics & Management
router.use('/skills', skillRouter);

// Dashboard Analytics & Aggregations
router.use('/dashboard', dashboardRouter);

// Sprint 2: Placement, Recruitment, Learning & Report Exports
router.use('/placement', placementRouter);
router.use('/recruitment', recruitmentRouter);
router.use('/learning', learningRouter);
router.use('/reports', reportsRouter);

// Sprint 3: Advanced Analytics, Attrition, Forecasting, Executive & Performance Reporting
router.use('/attrition', attritionRouter);
router.use('/forecasting', forecastingRouter);
router.use('/executive', executiveRouter);
router.use('/performance', performanceRouter);
router.use('/audit-logs', auditRouter);

export const apiRouter = router;
