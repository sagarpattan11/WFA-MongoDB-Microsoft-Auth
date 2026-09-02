import { Router } from 'express';
import { healthRouter } from './health.router';

const apiRouter = Router();

// Mount sub-routers
apiRouter.use('/health', healthRouter);

// Module route hooks (Authentication, Attendance, Employees, etc. will be plugged here)
apiRouter.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Workforce Analytics Platform API v1',
    docs: '/api/v1/docs',
    timestamp: new Date().toISOString(),
  });
});

export { apiRouter };
