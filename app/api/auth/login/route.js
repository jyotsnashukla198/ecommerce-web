import {Pool} from "pg";
import bcrypt from "bcryptjs";
import {SignJWT} from "jose";
import { cookies} from "next/headers";

const pool = new Pool({connectionString:process.env.DATABASE_URL});
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req){
  try{
    const {email,password} = await req.json();
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = rows[0];
    // if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    //     return Response.json({ error: "Invalid email or password" }, { status: 401 });
    //   }
    if (!user) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }
    const token = await new SignJWT({ id: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
   const cookieStore = await cookies();
  cookieStore.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });

  return Response.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

}

