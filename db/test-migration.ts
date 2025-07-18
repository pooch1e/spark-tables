import { runMigrations } from './migrate.ts';

const url =
  process.env.TEST_DATABASE_URL ||
  'postgresql://joelkram@localhost:5432/spark_test_database';

runMigrations(url)
  .then(() => {
    console.log('Test DB migrations complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Test DB migration failed:', err);
    process.exit(1);
  });
