import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app';

describe('WebAuthn / Passkey & FIDO2 Security Test Suite (Task 5 & 6)', () => {
  const app = createApp();

  // 1. Unauthenticated Session Verification
  it('GET /api/v1/auth/me returns unauthenticated status when no session exists', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isAuthenticated).toBe(false);
  });

  // 2. Registration Challenge Payload Validation
  it('POST /api/v1/auth/register-challenge rejects when username or email is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register-challenge')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // 3. Registration Verification Payload Validation
  it('POST /api/v1/auth/register-verify rejects when response payload is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register-verify')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // 4. Login Verification Payload Validation
  it('POST /api/v1/auth/login-verify rejects when credential response is missing', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login-verify')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // 5. Protected Route Enforcement: GET Credentials
  it('GET /api/v1/auth/credentials requires active authentication session (401)', async () => {
    const res = await request(app).get('/api/v1/auth/credentials');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // 6. Protected Route Enforcement: Rename Credential
  it('PATCH /api/v1/auth/credentials/:id requires active authentication session (401)', async () => {
    const res = await request(app)
      .patch('/api/v1/auth/credentials/cred_123')
      .send({ friendlyName: 'Office YubiKey' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // 7. Protected Route Enforcement: Revoke Credential
  it('DELETE /api/v1/auth/credentials/:id requires active authentication session (401)', async () => {
    const res = await request(app).delete('/api/v1/auth/credentials/cred_123');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
