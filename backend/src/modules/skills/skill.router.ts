import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  getSkillAnalyticsOverviewHandler,
  getSkillGapsHandler,
  getSkillRecommendationsHandler,
  getSkillsHandler,
} from './skill.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getSkillsHandler);
router.get('/analytics/overview', getSkillAnalyticsOverviewHandler);
router.get('/analytics/gaps', getSkillGapsHandler);
router.get('/analytics/recommendations', getSkillRecommendationsHandler);

export const skillRouter = router;
