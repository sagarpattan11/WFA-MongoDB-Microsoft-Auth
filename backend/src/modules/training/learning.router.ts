import { Router } from 'express';
import {
  getLearningEnrollmentsHandler,
  getLearningSkillImpactHandler,
  getLearningSummaryHandler,
} from './learning.controller';

const router = Router();

router.get('/analytics/summary', getLearningSummaryHandler);
router.get('/analytics/skill-impact', getLearningSkillImpactHandler);
router.get('/enrollments', getLearningEnrollmentsHandler);

export const learningRouter = router;
