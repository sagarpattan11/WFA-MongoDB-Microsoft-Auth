import { Router } from 'express';
import {
  getPlacementBreakdownHandler,
  getPlacementCandidatesHandler,
  getPlacementFunnelHandler,
  getPlacementSummaryHandler,
} from './placement.controller';

const router = Router();

router.get('/analytics/summary', getPlacementSummaryHandler);
router.get('/analytics/funnel', getPlacementFunnelHandler);
router.get('/analytics/breakdown', getPlacementBreakdownHandler);
router.get('/candidates', getPlacementCandidatesHandler);

export const placementRouter = router;
