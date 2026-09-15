import { Router } from 'express';
import {
  getAttritionDriversHandler,
  getAttritionEmployeesHandler,
  getAttritionRiskMatrixHandler,
  getAttritionSummaryHandler,
  getModelEvaluationHandler,
  updateAttritionStatusHandler,
} from './attrition.controller';

const router = Router();

router.get('/summary', getAttritionSummaryHandler);
router.get('/risk-matrix', getAttritionRiskMatrixHandler);
router.get('/drivers', getAttritionDriversHandler);
router.get('/employees', getAttritionEmployeesHandler);
router.get('/model-metrics', getModelEvaluationHandler);
router.patch('/employees/:id/status', updateAttritionStatusHandler);

export const attritionRouter = router;
