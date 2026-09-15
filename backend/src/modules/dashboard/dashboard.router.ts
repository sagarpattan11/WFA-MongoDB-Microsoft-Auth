import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  getDashboardChartsHandler,
  getDashboardKpisHandler,
} from './dashboard.controller';

const router = Router();

router.get('/kpis', requireAuth, getDashboardKpisHandler);
router.get('/charts', requireAuth, getDashboardChartsHandler);

export const dashboardRouter = router;
