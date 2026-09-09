import mongoose from 'mongoose';
import { env } from './env.config';

let isConnected = false;

export const connectDatabase = async (): Promise<typeof mongoose | null> => {
  if (isConnected) {
    return mongoose;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Failure:', error);
    // In dev mode, keep running so other non-database features or setup tests can operate
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️ MongoDB connection lost. Reconnecting...');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error event:', err);
});

export const disconnectDatabase = async (): Promise<void> => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log('🛑 MongoDB disconnected gracefully.');
};
