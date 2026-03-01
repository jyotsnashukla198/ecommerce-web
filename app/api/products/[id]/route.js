import pool from "@/lib/db";

export async function GET(req,{params}){
    try{
        const {id} = await params;
        const {rows} = await pool.query('SELECT * from mobilephones WHERE squid = $1',[id])
        if(rows.length === 0){
           return Response.json({error:"Product not found"},{status:404})
        }
        return Response.json(rows[0]);
    }catch(error){
        console.error("error happened while fetching data",error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}