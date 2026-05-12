"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="w-full max-w-md bg-white p-8 shadow-2xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          MADISON GROUP
        </p>

        <h1 className="font-serif text-4xl font-bold">
          Welcome Back
        </h1>

        <p className="mt-4 text-[#1A1A1A]/70">
          Login to access your saved homes, searches, and account.
        </p>

        <form onSubmit={handleLogin} className="mt-8 grid gap-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {message && (
            <p className="text-sm text-red-500">
              {message}
            </p>
          )}
        </form>

        <p className="mt-8 text-sm text-[#1A1A1A]/60">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[#B19A55]">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}