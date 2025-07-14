const { execSync } = require('child_process');
require('dotenv').config({ path: '.env.test' });

const testDbUrl = process.env.TEST_DATABASE_URL;

if (!testDbUrl) {
  console.error('TEST_DATABASE_URL not found in .env.test');
  process.exit(1);
}

console.log('Setting up test database...');
console.log('Database URL:', testDbUrl);

try {
  // Run migrations
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: testDbUrl },
    stdio: 'inherit',
  });

  console.log('✅ Test database setup complete!');
} catch (error) {
  console.error('❌ Error setting up test database:', error);
  process.exit(1);
}
