import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import type { Database } from './schema';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle<Database>(sql, { schema });


