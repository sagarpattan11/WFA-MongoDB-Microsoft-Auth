/**
 * Microsoft Entra ID Authentication Configuration & Status
 */

export interface MicrosoftAuthConfig {
  clientId?: string;
  tenantId?: string;
  redirectUri?: string;
  isConfigured: boolean;
}

export const getMicrosoftAuthConfig = (): MicrosoftAuthConfig => {
  const clientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID as string | undefined;
  const tenantId = import.meta.env.VITE_MICROSOFT_TENANT_ID as string | undefined;
  const redirectUri = (import.meta.env.VITE_MICROSOFT_REDIRECT_URI as string | undefined) || window.location.origin + '/auth/callback';

  return {
    clientId,
    tenantId,
    redirectUri,
    isConfigured: Boolean(clientId && tenantId),
  };
};
