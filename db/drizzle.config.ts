import 'dotenv/config';

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

const config = {
  schema: './db/schema.ts',
  out: './drizzle',
  driver: 'postgres-js',
  dialect: 'postgresql',
  dbCredentials: {
    connectionString: getDatabaseUrl(),
  },
};
export default config;
