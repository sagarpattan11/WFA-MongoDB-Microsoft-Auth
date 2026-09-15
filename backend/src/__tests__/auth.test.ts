import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app';

describe('WebAuthn Auth API Endpoints', () => {
  const app = createApp();

  it('GET /api/v1/auth/me returns unauthenticated status when no session exists', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isAuthenticated).toBe(false);
  });

  it('POST /api/v1/auth/register-challenge rejects when username or email is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register-challenge')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/register-verify rejects when response payload is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register-verify')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/v1/auth/login-verify rejects when credential response is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login-verify')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/auth/credentials requires authentication', async () => {
    const res = await request(app).get('/api/v1/auth/credentials');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
