import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware';
import {
  getCredentialsHandler,
  getMeHandler,
  loginChallengeHandler,
  loginVerifyHandler,
  logoutHandler,
  registerChallengeHandler,
  registerVerifyHandler,
  renameCredentialHandler,
  revokeCredentialHandler,
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

export const authRouter = router;
