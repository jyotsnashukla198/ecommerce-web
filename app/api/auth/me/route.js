import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(){
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if(!token){
       return Response.json({user:null},{status:401});
    }

    try{
     const {payload} = await jwtVerify(token,secret);
     return Response.json({ user: payload });
    }catch(error){
        return Response.json({user:null},{status:401});
    }

}