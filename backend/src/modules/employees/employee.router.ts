import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  createEmployeeHandler,
  deleteEmployeeHandler,
  exportEmployeesHandler,
  getEmployeeByIdHandler,
  getEmployeesHandler,
  importEmployeesHandler,
  restoreEmployeeHandler,
  updateEmployeeHandler,
  updateEmployeeStatusHandler,
} from './employee.controller';

const router = Router();

router.get('/', requireAuth, getEmployeesHandler);
router.post('/', requireAuth, createEmployeeHandler);
router.get('/export', requireAuth, exportEmployeesHandler);
router.post('/import', requireAuth, importEmployeesHandler);
router.get('/:id', requireAuth, getEmployeeByIdHandler);
router.put('/:id', requireAuth, updateEmployeeHandler);
router.patch('/:id/status', requireAuth, updateEmployeeStatusHandler);
router.patch('/:id/restore', requireAuth, restoreEmployeeHandler);
router.delete('/:id', requireAuth, deleteEmployeeHandler);

export const employeeRouter = router;
