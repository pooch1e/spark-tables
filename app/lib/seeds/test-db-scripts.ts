import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error(
    'TEST_DATABASE_URL environment variable is required for testing'
  );
}

// Initialize Prisma client for testing
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Setup function to run before all tests
const setupTestDatabase = async () => {
  try {
    // Push the schema to the test database
    execSync('npx prisma db push --force-reset', {
      env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
      stdio: 'inherit',
    });

    console.log('✅ Test database setup complete');
  } catch (error) {
    console.error('❌ Failed to setup test database:', error);
    process.exit(1);
  }
};

// Cleanup function
const cleanupTestDatabase = async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error disconnecting from test database:', error);
  }
};

// Run setup
setupTestDatabase();

// Global cleanup on process exit
process.on('beforeExit', cleanupTestDatabase);
process.on('SIGINT', cleanupTestDatabase);
process.on('SIGTERM', cleanupTestDatabase);

export { prisma };
