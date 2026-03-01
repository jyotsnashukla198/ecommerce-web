import { Pool } from "pg";

const pool = new Pool({connectionString:process.env.DATABASE_URL});

export async function GET(req) {
try{
const {searchParams} = new URL(req.url); 
const id = searchParams.get("id");
const email = searchParams.get("email");
if (!id || !email) {
    return Response.json({ error: "id and email are required" }, { status: 400 });
  }
  const { rows } = await pool.query("SELECT * FROM usersCart WHERE id = $1 AND email = $2;",[id,email]);
  return Response.json(rows);
}catch(error){
    console.error("Cart fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
}
}

export async function DELETE(req){
    try{
    const {searchParams} = new URL(req.url); 
    const user_id = searchParams.get("id");
    const squid = searchParams.get("squid");

    if (!user_id || !squid) {
        return Response.json({ error: "user_id and squid  are required" }, { status: 400 });
    }
    await pool.query(
        "DELETE FROM usersCart WHERE id = $1 AND item->>'squid' = $2",[user_id,squid]
    );
    return Response.json({message:"Item removed"});
    }catch(error){
      console.log("Cart delete error:",error);
      return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
