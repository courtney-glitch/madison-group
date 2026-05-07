"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Account created. Check your email.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-md">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          MADISON GROUP
        </p>

        <h1 className="font-serif text-4xl font-bold">
          Create Account
        </h1>

        <form onSubmit={handleSignup} className="mt-10 grid gap-5">
          <div>
            <label className="block font-serif text-sm font-bold">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
            />
          </div>

          <div>
            <label className="block font-serif text-sm font-bold">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-[#1A1A1A]/20 px-4 py-3 outline-none focus:border-[#B19A55]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {message && (
            <p className="text-sm text-[#B19A55]">
              {message}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}