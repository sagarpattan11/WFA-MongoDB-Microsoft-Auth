import { connectDatabase, disconnectDatabase } from '../config/database';
import { seedDatabase } from './seed';

const runSeed = async (): Promise<void> => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await connectDatabase();
    console.log('Starting seed process (force: true)...');
    await seedDatabase(true);
    console.log('Seeding finished successfully.');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
};

runSeed();
