import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString:
      process.env.DATABASE_URL ||
      'postgresql://joelkram@localhost:5432/spark_database',
  },
} satisfies Config;
