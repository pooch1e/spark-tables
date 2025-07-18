import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.ts';

const getDatabaseUrl = () => {
  if (process.env.NODE_ENV === 'test') {
    return (
      process.env.TEST_DATABASE_URL ||
      'postgresql://joelkram@localhost:5432/spark_test_database'
    );
  }
  return (
    process.env.DATABASE_URL ||
    'postgresql://joelkram@localhost:5432/spark_database'
  );
};

const connectionString = getDatabaseUrl();

// Create the connection
const client = postgres(connectionString);

// Create the database instance
export const db = drizzle(client, { schema });

// Helper for closing connection (useful in tests)
export const closeConnection = async () => {
  await client.end();
};
