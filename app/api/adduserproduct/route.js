import { Pool } from "pg";

const pool = new Pool({connectionString:process.env.DATABASE_URL});

export async function POST(req){
    try{
    const {user_id,pid,quantity} = await req.json();
    let { rows: cartRows } = await pool.query(
      "SELECT cart_id FROM carts WHERE user_id = $1", [user_id]
    );
    let cart_id;
    if(cartRows && cartRows.length === 0){
      const {rows:newCart}  = await pool.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING cart_id",
        [user_id]
      );
      cart_id = newCart[0].cart_id;
    }else{
       cart_id = cartRows[0].cart_id; 
    }
    const { rows: existing } = await pool.query(
      "SELECT cart_item_id FROM cart_items WHERE cart_id = $1 AND pid = $2",
      [cart_id, pid]
    );
      if (existing.length > 0) {
      // Increment quantity
      await pool.query(
        "UPDATE cart_items SET quantity = quantity + 1 WHERE cart_item_id = $1",
        [existing[0].cart_item_id]
      );
    } else {
      // Insert new item
      await pool.query(
        "INSERT INTO cart_items (cart_id, pid, quantity) VALUES ($1, $2, $3)",
        [cart_id, pid, quantity]
      );
    }
      return Response.json({ message: "item added succesfuly",}, { status: 201 });
    }catch(error){
        console.log("Register error", error);
        return Response.json({error:"Internal server error"},{status:500}) 
    }

} 