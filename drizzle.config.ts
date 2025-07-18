// drizzle.config.ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const connectionString =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

// Debug: log the connection string (remove this after fixing)
console.log('Environment:', process.env.NODE_ENV);
console.log('Connection string:', connectionString);

if (!connectionString) {
  throw new Error(
    'Database connection string is required. Check your .env file.'
  );
}

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    connectionString,
  },
  verbose: true,
  strict: true,
});
