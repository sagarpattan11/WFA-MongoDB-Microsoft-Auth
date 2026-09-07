import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  SESSION_SECRET: z.string().default('wfa-session-secret-change-in-production'),
  
  // Optional database URI
  MONGODB_URI: z.string().optional(),

  // Optional Microsoft Entra ID variables
  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_TENANT_ID: z.string().optional(),
  MICROSOFT_REDIRECT_URI: z.string().optional(),
  MICROSOFT_POST_LOGOUT_REDIRECT_URI: z.string().optional(),
  MICROSOFT_ALLOWED_EMAIL_DOMAIN: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

const parseEnv = (): EnvConfig => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Environment configuration validation failed:');
    console.error(result.error.format());
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();

/**
 * Diagnostic helper to verify whether optional external services are configured.
 */
export const validateExternalModuleConfig = (module: 'mongodb' | 'microsoft'): boolean => {
  if (module === 'mongodb') {
    if (!env.MONGODB_URI) {
      console.warn('⚠️ MongoDB configuration is missing (MONGODB_URI). Active persistence pending.');
      return false;
    }
    return true;
  }

  if (module === 'microsoft') {
    const isConfigured = Boolean(
      env.MICROSOFT_CLIENT_ID &&
      env.MICROSOFT_CLIENT_SECRET &&
      env.MICROSOFT_TENANT_ID &&
      env.MICROSOFT_REDIRECT_URI
    );

    if (!isConfigured) {
      console.warn('⚠️ Microsoft Entra ID credentials are incomplete. SSO module will operate in standby mode.');
      return false;
    }
    return true;
  }

  return false;
};
