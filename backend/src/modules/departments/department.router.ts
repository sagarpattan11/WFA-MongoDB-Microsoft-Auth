import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  createDepartmentHandler,
  getDepartmentsHandler,
  updateDepartmentHandler,
} from './department.controller';

const router = Router();

router.get('/', requireAuth, getDepartmentsHandler);
router.post('/', requireAuth, createDepartmentHandler);
router.put('/:id', requireAuth, updateDepartmentHandler);

export const departmentRouter = router;
