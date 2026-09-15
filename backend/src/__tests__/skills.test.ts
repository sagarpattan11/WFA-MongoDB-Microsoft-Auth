import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app';

describe('Skill Analytics & Management API Protection', () => {
  const app = createApp();

  it('GET /api/v1/skills requires authentication session (401)', async () => {
    const res = await request(app).get('/api/v1/skills');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/skills/analytics/overview requires authentication session (401)', async () => {
    const res = await request(app).get('/api/v1/skills/analytics/overview');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/skills/analytics/gaps requires authentication session (401)', async () => {
    const res = await request(app).get('/api/v1/skills/analytics/gaps');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/skills/analytics/recommendations requires authentication session (401)', async () => {
    const res = await request(app).get('/api/v1/skills/analytics/recommendations');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/locations requires authentication session (401)', async () => {
    const res = await request(app).get('/api/v1/locations');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/roles requires authentication session (401)', async () => {
    const res = await request(app).get('/api/v1/roles');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
