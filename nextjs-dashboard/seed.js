require('dotenv').config();
const postgres = require('postgres');
const bcrypt = require('bcrypt');

const sql = postgres(process.env.POSTGRES_URL, {
  ssl: 'require',
});

async function seed() {
  try {
    await sql`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;

    const hashedPassword = await bcrypt.hash('123456', 10);

    await sql`
      INSERT INTO users (name, email, password)
      VALUES (
        'Test User',
        'user@nextmail.com',
        ${hashedPassword}
      )
      ON CONFLICT (email) DO NOTHING;
    `;

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await sql.end();
  }
}

seed();