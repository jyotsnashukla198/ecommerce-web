"use client";
import { useState, useEffect } from "react";


export default function CartPage(){
    const [user,setUser] = useState(null);
    const  [cart,setCart] = useState([]);
    function updateQuantity(){

    }
    async function removeItemFromDB(pid){
        await fetch(`/api/cartproducts?user_id=${user.user_id}&pid=${pid}`,{
            method: "DELETE",
        })
    }
    async function updateItemFromDB(pid,quantity){
        await fetch(`/api/cartproducts?id=${user.user_id}&pid=${pid}&quantity=${quantity}`,{
            method: "PATCH",
        })
    }
    async function updateCart(pid,quantity){
      if(quantity == 0){
        removeItem(pid);
      }else if(quantity>0){
        updateItemFromDB(pid,quantity);
        const updatedCart = cart.map((item)=>{
            if(item.pid === pid){
                item.quantity = quantity;
            }
            return item;
        });
        setCart(updatedCart);
      }
    }
    async function removeItem(pid){
     console.log("removing item:", pid);
     const updatedCart = cart.filter((item)=>item.pid!=pid);
     setCart(updatedCart);
     removeItemFromDB(pid);
    }
    useEffect(() => {
    async function getProducts(user){
        const res = await fetch(`/api/cartproducts?user_id=${user.user_id}&email=${user.email}`);
        const data = await res.json();
        console.log(data);
        setCart(data);
    }
    async function checkAuth(){
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setUser(data.user);
        if(data && data.user){
            getProducts(data.user);
        }
      }

      checkAuth();
    }, []);
    const total = cart.reduce((sum, item) => sum + parseInt(item.price), 0);
      return(
       <div className="min-h-screen bg-zinc-50 dark:bg-black px-6 py-12">
        <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-black dark:text-white">Your Cart</h1>
          {user && <p className="text-sm text-zinc-500">{user.email}</p>}
         </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 mb-4">Your cart is empty</p>
            <a href="/products" className="bg-black dark:bg-white text-white dark:text-black text-sm font-medium px-6 py-2 rounded-full hover:opacity-80 transition-opacity">
              Browse Products
            </a>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {cart.map((item,index) => (
                <div key={index} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-zinc-500 uppercase tracking-wide">{item.brand}</p>
                    <p className="text-base font-medium text-black dark:text-white">{item.model}</p>
                    <p className="text-xs text-zinc-500">{item.ram_gb} GB · {item.color}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => updateCart(item?.pid,item.quantity-1)} className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 text-black dark:text-white flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800">−</button>
                    <span className="text-sm font-medium text-black dark:text-white w-5 text-center">{item.quantity}</span>
                    <button onClick={() =>  updateCart(item?.pid,item.quantity+1)} className="w-7 h-7 rounded-full border border-zinc-200 dark:border-zinc-700 text-black dark:text-white flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800">+</button>
                  </div>

                  <p className="text-base font-semibold text-black dark:text-white w-20 text-right">
                    ${item.price}
                  </p>

                  <button onClick={() => removeItem(item?.pid)} className="text-zinc-400 hover:text-red-500 transition-colors text-sm">
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-zinc-500 text-sm">Total</span>
                <span className="text-2xl font-semibold text-black dark:text-white">${total}</span>
              </div>
              <button className="w-full bg-black dark:bg-white text-white dark:text-black font-medium py-3 rounded-full hover:opacity-80 transition-opacity">
                Checkout
              </button>
            </div>
          </>
        )}
         </div>
        </div>
      )
}