import { Router } from 'express';
import {
  getPerformanceRosterHandler,
  getPerformanceSummaryHandler,
  getPerformanceTrendsHandler,
} from './performance.controller';

const router = Router();

router.get('/summary', getPerformanceSummaryHandler);
router.get('/trends', getPerformanceTrendsHandler);
router.get('/reviews', getPerformanceRosterHandler);

export const performanceRouter = router;
