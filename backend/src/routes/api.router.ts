import { Router } from 'express';
import { authRouter } from '../modules/auth/auth.router';
import { dashboardRouter } from '../modules/dashboard/dashboard.router';
import { departmentRouter } from '../modules/departments/department.router';
import { employeeRouter } from '../modules/employees/employee.router';
import { locationRouter } from '../modules/locations/location.router';
import { roleRouter } from '../modules/roles/role.router';
import { skillRouter } from '../modules/skills/skill.router';
import { teamRouter } from '../modules/teams/team.router';
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

export const apiRouter = router;
