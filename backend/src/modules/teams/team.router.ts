import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { createTeamHandler, getTeamsHandler } from './team.controller';

const router = Router();

router.get('/', requireAuth, getTeamsHandler);
router.post('/', requireAuth, createTeamHandler);

export const teamRouter = router;
