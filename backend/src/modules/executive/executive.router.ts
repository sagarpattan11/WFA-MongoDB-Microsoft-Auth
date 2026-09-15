import { Router } from 'express';
import {
  getExecutiveAlertsHandler,
  getExecutiveOverviewHandler,
  markAlertReadHandler,
  markAllAlertsReadHandler,
  resolveAlertHandler,
} from './executive.controller';

const router = Router();

router.get('/overview', getExecutiveOverviewHandler);
router.get('/alerts', getExecutiveAlertsHandler);
router.patch('/alerts/:id/read', markAlertReadHandler);
router.patch('/alerts/:id/resolve', resolveAlertHandler);
router.post('/alerts/read-all', markAllAlertsReadHandler);

export const executiveRouter = router;
