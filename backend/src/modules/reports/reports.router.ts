import { Router } from 'express';
import { exportReportHandler } from './export.controller';

const router = Router();

router.get('/export', exportReportHandler);

export const reportsRouter = router;
