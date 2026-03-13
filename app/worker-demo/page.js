"use client";

import {useEffect, useRef, useState} from "react";

export default function WorkerDemo() {
    const workerRef = useRef(null);
    const [result, setResult] = useState([]);
    const [status, setStatus] = useState("idle");
    useEffect(()=>{
    workerRef.current = new Worker("/worker.js");
     workerRef.current.onmessage = (event) => { 
         console.log("Page received:", event.data);
        const {type,result} = event.data;
        if(type === 'RESULT'){
            setResult(result);
            setStatus("done");
            console.log("Main thread: received result", result);
        }
     }
     workerRef.current.onerror = (err) => {
        console.error("Worker error",err);
        setStatus("error");
     }

     return () => workerRef.current.terminate();
    },[])
    function runWorker() {
    setStatus("processing");

    const products = [
      { pid: 1, model: "iPhone", price: 999 },
      { pid: 2, model: "Samsung", price: 799 },
      { pid: 3, model: "Pixel", price: 599 },
      { pid: 4, model: "OnePlus", price: 499 },
      { pid: 5, model: "MacBook", price: 1999 },
    ];

    // Send data to worker thread
    workerRef.current.postMessage({ type: "CALCULATE", data: products });
  }
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-zinc-800 mb-6">Web Worker Demo</h1>

        <button
          onClick={runWorker}
          disabled={status === "processing"}
          className="bg-black text-white px-6 py-2 rounded-full text-sm disabled:opacity-50"
        >
          {status === "processing" ? "Processing..." : "Run Worker"}
        </button>

        {status === "done" && (
          <div className="mt-6">
            <p className="text-green-500 text-sm mb-2">Done! Products under $1000:</p>
            {result.map((p) => (
              <div key={p.pid} className="text-zinc-700 text-sm py-1 border-b">
                {p.model} — ${p.price}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}