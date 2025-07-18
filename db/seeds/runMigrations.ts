import fs from 'fs';
import path from 'path';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const client = new Client({
  connectionString: process.env.TEST_DATABASE_URL,
});

async function runMigrations() {
  await client.connect();

  // Ensure migration table exists
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      run_on TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  const files = fs
    .readdirSync(path.resolve('../db/migrations'))
    .filter((f) => f.endsWith('.sql'));
  files.sort();

  for (const file of files) {
    // Check if migration ran before
    const res = await client.query(
      'SELECT 1 FROM migrations WHERE filename = $1',
      [file]
    );
    if (res.rowCount === 0) {
      console.log(`Running migration: ${file}`);

      const sql = fs.readFileSync(
        path.resolve('./db/migrations', file),
        'utf8'
      );

      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO migrations (filename) VALUES ($1)', [
          file,
        ]);
        await client.query('COMMIT');
        console.log(`Migration ${file} completed.`);
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Migration ${file} failed:`, err);
        process.exit(1);
      }
    } else {
      console.log(`Skipping already run migration: ${file}`);
    }
  }

  await client.end();
}

runMigrations().catch((err) => {
  console.error('Migration runner failed:', err);
  process.exit(1);
});
