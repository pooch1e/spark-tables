import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// update pg client
const runMigrations = async (databaseUrl?: string) => {
  const url = databaseUrl || process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is required');
  }

  const migrationClient = postgres(url, { max: 1 });
  const db = drizzle(migrationClient);

  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './db/migrations' });
  console.log('Migrations completed!');

  await migrationClient.end();
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations().catch(console.error);
}

export { runMigrations };
