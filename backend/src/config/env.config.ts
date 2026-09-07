import { config } from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  SESSION_SECRET: z.string().default('wfa-passkey-session-secret-enterprise-grade'),
  
  // MongoDB Connection URI
  MONGODB_URI: z.string().default('mongodb://localhost:27017/wfa_db'),

  // WebAuthn / Passkey Relying Party configuration
  RP_NAME: z.string().default('Workforce Analytics Platform'),
  RP_ID: z.string().default('localhost'),
  ORIGIN: z.string().default('http://localhost:3000'),
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
