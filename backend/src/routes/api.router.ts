import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.router';
import { dashboardRouter } from '../modules/dashboard/dashboard.router';
import { departmentRouter } from '../modules/departments/department.router';
import { employeeRouter } from '../modules/employees/employee.router';
import { teamRouter } from '../modules/teams/team.router';
import { healthRouter } from './health.router';

const router = Router();

// Health Check
router.use('/health', healthRouter);

// Authentication & Passkeys
router.use('/auth', authRouter);

// Employee Management
router.use('/employees', employeeRouter);

// Departments & Teams
router.use('/departments', departmentRouter);
router.use('/teams', teamRouter);

// Dashboard Analytics & Aggregations
router.use('/dashboard', dashboardRouter);

export const apiRouter = router;
