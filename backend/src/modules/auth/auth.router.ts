import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  getCredentialsHandler,
  getMeHandler,
  listUsersHandler,
  loginChallengeHandler,
  loginVerifyHandler,
  logoutHandler,
  registerChallengeHandler,
  registerVerifyHandler,
  renameCredentialHandler,
  revokeCredentialHandler,
  updateUserRoleHandler,
} from './auth.controller';

const router = Router();

// WebAuthn Passkey Registration
router.post('/register-challenge', registerChallengeHandler);
router.post('/register-verify', registerVerifyHandler);

// WebAuthn Passkey Login
router.post('/login-challenge', loginChallengeHandler);
router.post('/login-verify', loginVerifyHandler);

// Session State & Logout
router.get('/me', getMeHandler);
router.post('/logout', logoutHandler);

// Credential Management (Protected)
router.get('/credentials', requireAuth, getCredentialsHandler);
router.patch('/credentials/:id', requireAuth, renameCredentialHandler);
router.delete('/credentials/:id', requireAuth, revokeCredentialHandler);

// User & Role Management (Protected)
router.get('/users', requireAuth, listUsersHandler);
router.patch('/users/:id/role', requireAuth, updateUserRoleHandler);

export const authRouter = router;
