import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { UAParser } from 'ua-parser-js';
import { env } from '../../config/env.config';
import { sendError, sendSuccess } from '../../utils/api-response';
import { AuthAuditLogModel } from './models/AuthAuditLog.model';
import { PasskeyModel } from './models/Passkey.model';
import { UserModel } from './models/User.model';

const getClientInfo = (req: Request) => {
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = (req.headers['user-agent'] as string) || 'Unknown Client';
  return { ipAddress, userAgent };
};

const getDeviceFriendlyName = (req: Request): string => {
  const userAgent = req.headers['user-agent'] || '';
  const parser = new UAParser(userAgent);
  const os = parser.getOS().name || 'Device';
  const browser = parser.getBrowser().name || 'Browser';
  return `${os} (${browser} Passkey)`;
};

/**
 * 1. Step 1 of Registration: Generate WebAuthn Registration Challenge Options
 */
export const registerChallengeHandler = async (req: Request, res: Response): Promise<void> => {
  const { ipAddress, userAgent } = getClientInfo(req);
  try {
    const { username, email, displayName } = req.body;

    if (!username || !email) {
      sendError(res, 'Username and corporate email are required.', 400);
      return;
    }

    const cleanUsername = String(username).toLowerCase().trim();
    const cleanEmail = String(email).toLowerCase().trim();
    const cleanDisplayName = displayName ? String(displayName).trim() : cleanUsername;

    // Check if user already exists, or prepare for new user creation
    let user = await UserModel.findOne({
      $or: [{ username: cleanUsername }, { email: cleanEmail }],
    });

    if (!user) {
      user = new UserModel({
        username: cleanUsername,
        email: cleanEmail,
        displayName: cleanDisplayName,
        roles: ['admin', 'hr', 'manager', 'team-lead', 'employee'],
      });
    }

    // Retrieve existing passkeys for this user to avoid duplicate registrations on same authenticator
    const userPasskeys = await PasskeyModel.find({ userId: user._id });

    // Generate Registration Options with WebAuthn Server
    const options = await generateRegistrationOptions({
      rpName: env.RP_NAME,
      rpID: env.RP_ID,
      userID: new Uint8Array(Buffer.from(user._id.toString())),
      userName: user.email,
      userDisplayName: user.displayName,
      attestationType: 'none',
      excludeCredentials: userPasskeys.map((pk) => ({
        id: pk.credentialID,
        transports: pk.transports as ('ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb')[],
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
      },
    });

    // Save challenge temporarily in session and user document
    user.currentChallenge = options.challenge;
    await user.save();

    if (req.session) {
      req.session.currentChallenge = options.challenge;
      req.session.userId = user._id.toString();
    }

    await AuthAuditLogModel.create({
      userId: user._id,
      username: user.username,
      action: 'register_challenge',
      success: true,
      ipAddress,
      userAgent,
    });

    sendSuccess(res, options, 'WebAuthn registration challenge generated successfully.');
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Registration challenge error:', error);
    await AuthAuditLogModel.create({
      action: 'register_challenge',
      success: false,
      ipAddress,
      userAgent,
      failureReason: errMsg,
    });
    sendError(res, 'Failed to generate registration challenge.', 500, 'CHALLENGE_ERROR', errMsg);
  }
};

/**
 * 2. Step 2 of Registration: Verify Authenticator Response and Persist Passkey in MongoDB
 */
export const registerVerifyHandler = async (req: Request, res: Response): Promise<void> => {
  const { ipAddress, userAgent } = getClientInfo(req);
  try {
    const { response, friendlyName } = req.body;

    if (!response) {
      sendError(res, 'Missing WebAuthn credential response payload.', 400);
      return;
    }

    const userId = req.session?.userId;
    if (!userId) {
      sendError(res, 'Registration session expired. Please restart registration.', 400);
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user || !user.currentChallenge) {
      sendError(res, 'User identity challenge not found or expired.', 400);
      return;
    }

    const origin = (req.headers.origin as string) || env.ORIGIN;

    // Verify response cryptographically
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: env.RP_ID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      await AuthAuditLogModel.create({
        userId: user._id,
        username: user.username,
        action: 'register_failure',
        success: false,
        ipAddress,
        userAgent,
        failureReason: 'Cryptographic signature verification failed',
      });
      sendError(res, 'WebAuthn passkey verification failed.', 400);
      return;
    }

    const { credential, credentialDeviceType, credentialBackedUp, aaguid } = verification.registrationInfo;
    const credentialID = credential.id;
    const credentialPublicKey = credential.publicKey;
    const counter = credential.counter;

    // Check if credential ID already registered
    const existingPasskey = await PasskeyModel.findOne({ credentialID });
    if (!existingPasskey) {
      const name = friendlyName || getDeviceFriendlyName(req);

      await PasskeyModel.create({
        userId: user._id,
        credentialID,
        credentialPublicKey: Buffer.from(credentialPublicKey),
        counter,
        credentialDeviceType: credentialDeviceType || 'singleDevice',
        credentialBackedUp: credentialBackedUp || false,
        transports: response.response?.transports || ['internal'],
        friendlyName: name,
        aaguid: aaguid ? String(aaguid) : undefined,
        lastUsedAt: new Date(),
      });
    }

    // Clear challenge & establish session
    user.currentChallenge = undefined;
    await user.save();

    if (req.session) {
      req.session.userId = user._id.toString();
      req.session.username = user.username;
      req.session.email = user.email;
      req.session.displayName = user.displayName;
      req.session.roles = user.roles;
    }

    await AuthAuditLogModel.create({
      userId: user._id,
      username: user.username,
      action: 'register_success',
      success: true,
      ipAddress,
      userAgent,
    });

    sendSuccess(
      res,
      {
        verified: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          roles: user.roles,
        },
      },
      'Passkey registered and session established successfully.',
      200
    );
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Registration verify error:', error);
    await AuthAuditLogModel.create({
      action: 'register_failure',
      success: false,
      ipAddress,
      userAgent,
      failureReason: errMsg,
    });
    sendError(res, 'Failed to verify passkey registration.', 500, 'VERIFY_ERROR', errMsg);
  }
};

/**
 * 3. Step 1 of Login: Generate Authentication Challenge Options
 */
export const loginChallengeHandler = async (req: Request, res: Response): Promise<void> => {
  const { ipAddress, userAgent } = getClientInfo(req);
  try {
    const { username } = req.body;

    let userPasskeys: InstanceType<typeof PasskeyModel>[] = [];
    let user = null;

    if (username) {
      const cleanUsername = String(username).toLowerCase().trim();
      user = await UserModel.findOne({
        $or: [{ username: cleanUsername }, { email: cleanUsername }],
      });

      if (user) {
        userPasskeys = await PasskeyModel.find({ userId: user._id });
      }
    }

    // Generate Authentication Options
    const options = await generateAuthenticationOptions({
      rpID: env.RP_ID,
      allowCredentials: userPasskeys.length > 0
        ? userPasskeys.map((pk) => ({
            id: pk.credentialID,
            transports: pk.transports as ('ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb')[],
          }))
        : undefined,
      userVerification: 'preferred',
    });

    if (user) {
      user.currentChallenge = options.challenge;
      await user.save();
    }

    if (req.session) {
      req.session.currentChallenge = options.challenge;
      if (user) req.session.userId = user._id.toString();
    }

    await AuthAuditLogModel.create({
      userId: user ? user._id : undefined,
      username: user ? user.username : username || 'Discoverable',
      action: 'login_challenge',
      success: true,
      ipAddress,
      userAgent,
    });

    sendSuccess(res, options, 'WebAuthn login challenge generated successfully.');
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Login challenge error:', error);
    await AuthAuditLogModel.create({
      action: 'login_challenge',
      success: false,
      ipAddress,
      userAgent,
      failureReason: errMsg,
    });
    sendError(res, 'Failed to generate authentication challenge.', 500, 'CHALLENGE_ERROR', errMsg);
  }
};

/**
 * 4. Step 2 of Login: Verify Passkey Authentication Response & Log In User
 */
export const loginVerifyHandler = async (req: Request, res: Response): Promise<void> => {
  const { ipAddress, userAgent } = getClientInfo(req);
  try {
    const { response } = req.body;

    if (!response || !response.id) {
      sendError(res, 'Missing authentication credential response.', 400);
      return;
    }

    // Find passkey record by credentialID
    const passkey = await PasskeyModel.findOne({ credentialID: response.id });
    if (!passkey) {
      await AuthAuditLogModel.create({
        action: 'login_failure',
        success: false,
        ipAddress,
        userAgent,
        failureReason: 'Unknown or unregistered credential ID',
      });
      sendError(res, 'Unrecognized passkey credential. Please register first.', 404);
      return;
    }

    const user = await UserModel.findById(passkey.userId);
    if (!user) {
      sendError(res, 'User account associated with this passkey was not found.', 404);
      return;
    }

    const expectedChallenge = req.session?.currentChallenge || user.currentChallenge;
    if (!expectedChallenge) {
      sendError(res, 'Authentication challenge expired. Please retry.', 400);
      return;
    }

    const origin = (req.headers.origin as string) || env.ORIGIN;

    // Verify authentication response with credential object
    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: env.RP_ID,
      credential: {
        id: passkey.credentialID,
        publicKey: new Uint8Array(passkey.credentialPublicKey),
        counter: passkey.counter,
        transports: passkey.transports as ('ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb')[],
      },
    });

    if (!verification.verified || !verification.authenticationInfo) {
      await AuthAuditLogModel.create({
        userId: user._id,
        username: user.username,
        action: 'login_failure',
        success: false,
        ipAddress,
        userAgent,
        failureReason: 'Signature verification failure',
      });
      sendError(res, 'Passkey authentication failed. Please try again.', 400);
      return;
    }

    // Update counter and lastUsedAt
    passkey.counter = verification.authenticationInfo.newCounter;
    passkey.lastUsedAt = new Date();
    await passkey.save();

    user.currentChallenge = undefined;
    await user.save();

    // Establish authenticated session
    if (req.session) {
      req.session.userId = user._id.toString();
      req.session.username = user.username;
      req.session.email = user.email;
      req.session.displayName = user.displayName;
      req.session.roles = user.roles;
    }

    await AuthAuditLogModel.create({
      userId: user._id,
      username: user.username,
      action: 'login_success',
      success: true,
      ipAddress,
      userAgent,
    });

    sendSuccess(
      res,
      {
        verified: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          roles: user.roles,
        },
      },
      'Welcome back! Passkey authentication successful.',
      200
    );
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Login verify error:', error);
    await AuthAuditLogModel.create({
      action: 'login_failure',
      success: false,
      ipAddress,
      userAgent,
      failureReason: errMsg,
    });
    sendError(res, 'Failed to verify passkey signature.', 500, 'VERIFY_ERROR', errMsg);
  }
};

/**
 * 5. Current Session Profile (`GET /api/v1/auth/me`)
 */
export const getMeHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      sendSuccess(res, { isAuthenticated: false, user: null });
      return;
    }

    const user = await UserModel.findById(userId).select('-currentChallenge');
    if (!user) {
      if (req.session) req.session.destroy(() => {});
      sendSuccess(res, { isAuthenticated: false, user: null });
      return;
    }

    sendSuccess(res, {
      isAuthenticated: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        roles: user.roles,
        createdAt: user.createdAt,
      },
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to load user session.', 500, 'SESSION_ERROR', errMsg);
  }
};

/**
 * 6. Logout (`POST /api/v1/auth/logout`)
 */
export const logoutHandler = async (req: Request, res: Response): Promise<void> => {
  const { ipAddress, userAgent } = getClientInfo(req);
  const userId = req.session?.userId;
  const username = req.session?.username;

  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
      }
    });
  }

  res.clearCookie('wfa_session');

  await AuthAuditLogModel.create({
    userId: userId ? new Types.ObjectId(userId) : undefined,
    username: username || 'Anonymous',
    action: 'logout',
    success: true,
    ipAddress,
    userAgent,
  });

  sendSuccess(res, { loggedOut: true }, 'Session destroyed and logged out successfully.');
};

/**
 * 7. List User Passkeys (`GET /api/v1/auth/credentials`)
 */
export const getCredentialsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      sendError(res, 'Unauthorized', 401);
      return;
    }

    const credentials = await PasskeyModel.find({ userId })
      .select('credentialID friendlyName credentialDeviceType transports lastUsedAt createdAt')
      .sort({ lastUsedAt: -1 });

    sendSuccess(res, credentials);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to retrieve credentials.', 500, 'CREDENTIAL_ERROR', errMsg);
  }
};

/**
 * 8. Rename a Passkey (`PATCH /api/v1/auth/credentials/:id`)
 */
export const renameCredentialHandler = async (req: Request, res: Response): Promise<void> => {
  const { ipAddress, userAgent } = getClientInfo(req);
  try {
    const userId = req.session?.userId;
    const { id } = req.params;
    const { friendlyName } = req.body;

    if (!friendlyName || !id) {
      sendError(res, 'Credential ID and friendly name are required.', 400);
      return;
    }

    const passkey = await PasskeyModel.findOne({ _id: id, userId });
    if (!passkey) {
      sendError(res, 'Passkey credential not found.', 404);
      return;
    }

    passkey.friendlyName = String(friendlyName).trim();
    await passkey.save();

    await AuthAuditLogModel.create({
      userId: new Types.ObjectId(userId),
      action: 'credential_rename',
      success: true,
      ipAddress,
      userAgent,
    });

    sendSuccess(res, passkey, 'Passkey renamed successfully.');
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to rename credential.', 500, 'RENAME_ERROR', errMsg);
  }
};

/**
 * 9. Revoke / Delete a Passkey (`DELETE /api/v1/auth/credentials/:id`)
 */
export const revokeCredentialHandler = async (req: Request, res: Response): Promise<void> => {
  const { ipAddress, userAgent } = getClientInfo(req);
  try {
    const userId = req.session?.userId;
    const { id } = req.params;

    if (!id) {
      sendError(res, 'Credential ID required.', 400);
      return;
    }

    const passkey = await PasskeyModel.findOneAndDelete({ _id: id, userId });
    if (!passkey) {
      sendError(res, 'Passkey not found or unauthorized to delete.', 404);
      return;
    }

    await AuthAuditLogModel.create({
      userId: new Types.ObjectId(userId),
      action: 'credential_revoke',
      success: true,
      ipAddress,
      userAgent,
    });

    sendSuccess(res, { deletedId: id }, 'Passkey revoked successfully.');
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    sendError(res, 'Failed to revoke credential.', 500, 'REVOKE_ERROR', errMsg);
  }
};
