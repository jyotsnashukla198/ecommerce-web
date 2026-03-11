import pool from "@/lib/db";

export async function GET() {
  const { rows } = await pool.query("SELECT * FROM products");
  return Response.json(rows, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
    },
  });
}
