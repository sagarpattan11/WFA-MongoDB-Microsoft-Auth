import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { createLocationHandler, getLocationsHandler } from './location.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getLocationsHandler);
router.post('/', createLocationHandler);

export const locationRouter = router;
