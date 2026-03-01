import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM mobilephones");
  return Response.json(rows);
}
