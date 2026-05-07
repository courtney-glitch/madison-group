"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Logged in successfully.");
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-md">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          MADISON GROUP
        </p>

        <h1 className="font-serif text-4xl font-bold">Login</h1>

        <form onSubmit={handleLogin} className="mt-10 grid gap-5">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
          />

          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
          />

          <button className="bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white">
            Login
          </button>

          {message && <p className="text-sm text-[#B19A55]">{message}</p>}
        </form>
      </section>
    </main>
  );
}