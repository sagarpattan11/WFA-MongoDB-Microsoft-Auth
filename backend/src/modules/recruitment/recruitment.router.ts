import { Router } from 'express';
import {
  getRecruitmentApplicationsHandler,
  getRecruitmentBreakdownHandler,
  getRecruitmentFunnelHandler,
  getRecruitmentRequisitionsHandler,
  getRecruitmentSummaryHandler,
} from './recruitment.controller';

const router = Router();

router.get('/analytics/summary', getRecruitmentSummaryHandler);
router.get('/analytics/funnel', getRecruitmentFunnelHandler);
router.get('/analytics/breakdown', getRecruitmentBreakdownHandler);
router.get('/requisitions', getRecruitmentRequisitionsHandler);
router.get('/applications', getRecruitmentApplicationsHandler);

export const recruitmentRouter = router;
