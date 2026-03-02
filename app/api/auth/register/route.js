import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({connectionString:process.env.DATABASE_URL});
export async function POST(req){
    try{
        const {email,password,name}= await req.json();
        if(!email || !password){
            return Response.json({error:'email and password is mandatory'});
        }
        const user_id = crypto.randomUUID();
        const {rows:existing} = await pool.query("SELECT user_id FROM users WHERE email = $1",[email])
        if (existing.length > 0) {
            return Response.json({ error: "Email already registered" }, { status: 409 });
          }
          const password_hash = await bcrypt.hash(password, 10);
          const { rows } = await pool.query(
            "INSERT INTO users (user_id, email, password_hash,full_name, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING user_id, email",
            [user_id, email, password_hash,name]
          );
          return Response.json({ message: "User registered successfully", user: rows[0] }, { status: 201 });

    }catch(error){
        console.log("Register error", error);
        return Response.json({error:"Internal server error"},{status:500})
    }

}
