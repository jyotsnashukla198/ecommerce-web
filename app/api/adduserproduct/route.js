import { Pool } from "pg";

const pool = new Pool({connectionString:process.env.DATABASE_URL});

export async function POST(req){
    try{
    const {id,email,item} = await req.json();
    const { rows } = await pool.query(
        "INSERT INTO usersCart (id, email, item, created_at) VALUES ($1, $2, $3, NOW())",
        [id, email, item]
      );
      return Response.json({ message: "item added succesfuly",}, { status: 201 });
    }catch(error){
        console.log("Register error", error);
        return Response.json({error:"Internal server error"},{status:500}) 
    }

} 