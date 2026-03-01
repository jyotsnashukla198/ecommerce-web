import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({connectionString:process.env.DATABASE_URL});
export async function POST(req){
    try{
        const {email,password}= await req.json();
        if(!email || !password){
            return Response.json({error:'email and password is mandatory'});
        }
        const id = Math.floor(Math.random() * 100);
        const {rows:existing} = await pool.query("SELECT id FROM users WHERE email = $1",[email])
        if (existing.length > 0) {
            return Response.json({ error: "Email already registered" }, { status: 409 });
          }
          const password_hash = await bcrypt.hash(password, 10);
          const { rows } = await pool.query(
            "INSERT INTO users (id, email, password_hash, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email",
            [id, email, password_hash]
          );
          return Response.json({ message: "User registered successfully", user: rows[0] }, { status: 201 });

    }catch(error){
        console.log("Register error", error);
        return Response.json({error:"Internal server error"},{status:500})
    }

}
