"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const[error,setError] = useState("");
    const[loading,setLoading] = useState("");
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
    
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    router.push("/products")
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
            <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-8">
            <h1 className="text-2xl font-semibold text-black dark:text-white mb-6">Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
            </div>
            <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-600 dark:text-zinc-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-black dark:bg-white text-white dark:text-black font-medium py-2 rounded-full hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
            </form>
        <p className="text-sm text-zinc-500 text-center mt-4">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-black dark:text-white font-medium hover:underline">Register</a>
            </p>
            </div>

        </div>
    )
}