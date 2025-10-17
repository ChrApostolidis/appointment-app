import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import type { Database } from "./schema";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle<Database>(pool, { schema });