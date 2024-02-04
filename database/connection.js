import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg
const env = dotenv.config().parsed

const db = new Pool({
  user: env.DB_USERNAME,
  host: env.DB_HOST,
  database: env.DB_NAME,
  password: env.DB_PASSWORD,
  port: env.DB_PORT,
})
export default db