import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use the provided Supabase URL
const DATABASE_URL = "postgresql://postgres.qzfbphcntjynkudctpuo:CRMN8N@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres";

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Test connection
pool.connect().then(() => {
  console.log('🔗 Connected to database: Supabase');
}).catch((err) => {
  console.error('🔴 Database connection error:', err.message);
});
