"use client";
import { useState, useEffect } from "react";
  
  
export default function ProductsPage(){
  const [products, setProducts] = useState([]);
  const[cart,setCart] = useState([]);
  const[added,setAdded] = useState({});
  const [user,setUser] = useState(null);
  useEffect(()=>{
    const saved = localStorage.getItem("cart");
    if(saved){
      setCart(JSON.parse(saved));
    }
  },[]);
  async function addtousercart(product){
    const res = await fetch("/api/adduserproduct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id:user.id,email:user.email, item:product }),
    });
  }

  function addToCart(product){
    try{
     const existing = cart.find((item)=>{
       return item?.id === product?.id;
     })
     let updatedCart;
     if(existing){
      updatedCart = cart.map((item)=>
        item?.id === product.id ? {...item, quantity: item.quantity + 1} : item
      );
    }else{
      updatedCart = [...cart,{quantity:1,...product}]
    }
    setCart(updatedCart);
    if(user){
      addtousercart(product);
    }else{
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    // Show "Added!" feedback briefly
    setAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [product.id]: false })), 1500);
  } catch(error){
    console.log("error",error);
  }
  }
  
  const totalItems = cart.reduce((sum, item) => sum + item?.quantity, 0);

    useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      console.log(res);
      const data = await res.json();
      console.log(data);
      setProducts(data);
    }
    async function checkAuth(){
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    }
    checkAuth();
    fetchProducts();
  }, []);
    return(
        <div className="min-h-screen bg-zinc-50 dark:bg-black px-6 py-12">
          {user ? (
              <p>Welcome, {user.email}</p>
            ) : (
              <a href="/login">Login</a>
            )}
             <h1 className="text-3xl font-semibold text-black dark:text-white mb-8">All Products</h1>
             <div className="flex items-center gap-2">
             Cart {
              totalItems>0 && (<span className="bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>)
             }
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <span className="text-xs text-zinc-500 uppercase tracking-wide">{product.brand}</span>
              <h2 className="text-lg font-medium text-black dark:text-white mt-1">{product.model}</h2>
              <span className="text-xs text-zinc-500 uppercase tracking-wide">{product.ram_gb} gb</span>
              <div className="text-xs text-zinc-500 uppercase tracking-wide">{product.color}</div>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xl font-semibold text-black dark:text-white">${product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-black dark:bg-white text-white dark:text-black text-sm font-medium px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
                >
                  {added[product.id] ? "Added!" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
        </div>
    )
}