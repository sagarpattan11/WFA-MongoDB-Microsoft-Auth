import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import { createRoleHandler, getRolesHandler } from './role.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getRolesHandler);
router.post('/', createRoleHandler);

export const roleRouter = router;
