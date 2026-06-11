import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/website_scraper',
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
