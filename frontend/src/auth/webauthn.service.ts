import {
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable,
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '../api/endpoints';

export interface PasskeyCredentialInfo {
  _id: string;
  credentialID: string;
  friendlyName: string;
  credentialDeviceType: string;
  transports: string[];
  lastUsedAt: string;
  createdAt: string;
}

export interface UserSessionData {
  id: string;
  username: string;
  email: string;
  displayName: string;
  roles: string[];
  createdAt?: string;
}

export const checkWebAuthnCapability = async (): Promise<{
  supported: boolean;
  platformAuthenticator: boolean;
}> => {
  const supported = browserSupportsWebAuthn();
  const platformAuthenticator = supported ? await platformAuthenticatorIsAvailable() : false;
  return { supported, platformAuthenticator };
};

/**
 * Perform WebAuthn Registration Ceremony
 */
export const registerWithPasskey = async (
  username: string,
  email: string,
  displayName?: string,
  friendlyName?: string
): Promise<UserSessionData> => {
  // 1. Request registration options from backend
  const optionsRes = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER_CHALLENGE, {
    username,
    email,
    displayName,
  });

  const options = optionsRes.data.data;

  // 2. Trigger browser passkey creation prompt (TouchID, FaceID, Windows Hello, Security Key)
  const attestationResponse = await startRegistration({ optionsJSON: options });

  // 3. Send authenticator response to backend for cryptographic verification
  const verifyRes = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER_VERIFY, {
    response: attestationResponse,
    friendlyName,
  });

  return verifyRes.data.data.user;
};

/**
 * Perform WebAuthn Authentication Ceremony
 */
export const loginWithPasskey = async (username?: string): Promise<UserSessionData> => {
  // 1. Request authentication options from backend
  const optionsRes = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN_CHALLENGE, {
    username,
  });

  const options = optionsRes.data.data;

  // 2. Trigger browser passkey login prompt
  const assertionResponse = await startAuthentication({ optionsJSON: options });

  // 3. Send signature response to backend for cryptographic verification
  const verifyRes = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN_VERIFY, {
    response: assertionResponse,
  });

  return verifyRes.data.data.user;
};

/**
 * Fetch Current Authenticated Session
 */
export const fetchCurrentUserSession = async (): Promise<{
  isAuthenticated: boolean;
  user: UserSessionData | null;
}> => {
  const res = await apiClient.get(API_ENDPOINTS.AUTH.ME);
  return res.data.data;
};

/**
 * Logout User
 */
export const logoutUserSession = async (): Promise<void> => {
  await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
};

/**
 * Get User's Registered Passkeys
 */
export const fetchUserCredentials = async (): Promise<PasskeyCredentialInfo[]> => {
  const res = await apiClient.get(API_ENDPOINTS.AUTH.CREDENTIALS);
  return res.data.data;
};

/**
 * Rename a Passkey
 */
export const renameUserCredential = async (
  id: string,
  friendlyName: string
): Promise<PasskeyCredentialInfo> => {
  const res = await apiClient.patch(API_ENDPOINTS.AUTH.RENAME_CREDENTIAL(id), {
    friendlyName,
  });
  return res.data.data;
};

/**
 * Revoke / Delete a Passkey
 */
export const revokeUserCredential = async (id: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.AUTH.REVOKE_CREDENTIAL(id));
};
