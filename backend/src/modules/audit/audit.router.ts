import { Router } from 'express';
import { getAuditLogsHandler } from './audit.controller';

const router = Router();

router.get('/', getAuditLogsHandler);

export const auditRouter = router;
