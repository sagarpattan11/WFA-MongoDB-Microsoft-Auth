import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app';

describe('Employee & Dashboard API Protection', () => {
  const app = createApp();

  it('GET /api/v1/employees requires authentication session', async () => {
    const res = await request(app).get('/api/v1/employees');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/dashboard/kpis requires authentication session', async () => {
    const res = await request(app).get('/api/v1/dashboard/kpis');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/dashboard/charts requires authentication session', async () => {
    const res = await request(app).get('/api/v1/dashboard/charts');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
