import pool from "@/lib/db";

export async function GET(req) {
try{
const {searchParams} = new URL(req.url); 
const user_id = searchParams.get("user_id");
const { rows } = await pool.query(
      `SELECT ci.cart_item_id, ci.quantity,
              p.pid, p.brand, p.model, p.price, p.ram_gb, p.color, p.storage_gb
       FROM carts c
       JOIN cart_items ci ON c.cart_id = ci.cart_id
       JOIN products p ON ci.pid = p.pid
       WHERE c.user_id = $1`,
      [user_id]
    );
    return Response.json(rows);
}catch(error){
    console.error("Cart fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
}
}

export async function DELETE(req){
    try{
    const {searchParams} = new URL(req.url); 
    const user_id = searchParams.get("user_id");
    const pid = searchParams.get("pid");

    if (!user_id || !pid) {
        return Response.json({ error: "user_id and squid  are required" }, { status: 400 });
    }
   await pool.query(
    `DELETE FROM cart_items WHERE pid = $1
     AND cart_id IN (SELECT cart_id FROM carts WHERE user_id = $2)`,
    [pid, user_id]
  );
    return Response.json({message:"Item removed"});
    }catch(error){
      console.log("Cart delete error:",error);
      return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
export async function PATCH(req){
    try{
      const {searchParams} = new URL(req.url);
      const pid = searchParams.get("pid");
      const user_id = searchParams.get("user_id");
      const quantity = searchParams.get("quantity");
      await pool.query(
    `UPDATE cart_items SET quantity = $1 WHERE pid = $2
     AND cart_id IN (SELECT cart_id FROM carts WHERE user_id = $3)`,
    [quantity, pid, user_id]
  );
      return Response.json({message:"Item updated"});
    }catch(error){
        console.error("Cart Update Error",error);
    }
}
