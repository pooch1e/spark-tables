import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const runMigrations = async (databaseUrl?: string) => {
  const url = databaseUrl || process.env.DATABASE_URL;

  if (!url) {
    throw new Error('DATABASE_URL is required');
  }

  const migrationClient = postgres(url, { max: 1 });
  const db = drizzle(migrationClient);

  console.log('Running migrations...');

  // Fixed: migrationsFolder should point to the folder, not the journal file
  await migrate(db, { migrationsFolder: './drizzle' });

  console.log('Migrations completed!');
  await migrationClient.end();
};

// Run migrations if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations().catch(console.error);
}

export { runMigrations };


