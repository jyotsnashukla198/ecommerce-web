import {Pool} from 'pg';


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});
pool.on('connect',(client)=>{
   client.on("query", (query) => {
        console.log("\nSQL:", query.text);
        console.log("Params:", query.values);
      }); 
});

export default pool;