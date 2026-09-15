import { Router } from 'express';
import {
  getDemandForecastsTableHandler,
  getForecastingProjectionsHandler,
  getForecastingSummaryHandler,
  getSkillDemandHandler,
  simulateScenarioHandler,
} from './forecasting.controller';

const router = Router();

router.get('/summary', getForecastingSummaryHandler);
router.get('/projections', getForecastingProjectionsHandler);
router.get('/skill-demand', getSkillDemandHandler);
router.get('/forecasts', getDemandForecastsTableHandler);
router.post('/simulate', simulateScenarioHandler);

export const forecastingRouter = router;
