import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app';

describe('Backend API Foundation Tests', () => {
  const app = createApp();

  describe('GET /api/v1/health', () => {
    it('should return 200 and healthy status payload', async () => {
      const res = await request(app).get('/api/v1/health');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('service', 'WFA API');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('404 Route Not Found', () => {
    it('should return 404 with structured error JSON for invalid endpoint', async () => {
      const res = await request(app).get('/api/v1/non-existent-route');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.error).toHaveProperty('code', 'ROUTE_NOT_FOUND');
    });
  });
});
