"use client";

import {useState,useEffect} from "react";
import {useParams,useRouter} from "next/navigation";

export default function ProductPage(){
  const{id} = useParams();
  const router = useRouter();
  const [product,setProduct] = useState(null);
  useEffect(()=>{
    async function fetchProduct(){
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
    }
    fetchProduct();
  },[id])
  if (!product) return <div className="min-h-screen flex items-center justify-center text-zinc-500">Loading...</div>;
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black px-6 py-12">
      <div className="max-w-2xl mx-auto">

        <button onClick={() => router.back()} className="text-sm text-zinc-500 hover:text-black dark:hover:text-white mb-8 flex items-center gap-1">
          ← Back
        </button>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
          <span className="text-xs text-zinc-500 uppercase tracking-widest">{product.brand}</span>
          <h1 className="text-3xl font-semibold text-black dark:text-white mt-1 mb-6">{product.model}</h1>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">RAM</p>
              <p className="text-lg font-medium text-black dark:text-white">{product.ram_gb} GB</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Color</p>
              <p className="text-lg font-medium text-black dark:text-white">{product.color}</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Brand</p>
              <p className="text-lg font-medium text-black dark:text-white">{product.brand}</p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Price</p>
              <p className="text-lg font-medium text-black dark:text-white">${product.price}</p>
            </div>
          </div>

          <button className="w-full bg-black dark:bg-white text-white dark:text-black font-medium py-3 rounded-full hover:opacity-80 transition-opacity">
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
}