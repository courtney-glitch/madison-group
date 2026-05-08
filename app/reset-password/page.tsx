"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully.");
      setPassword("");
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-md">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          MADISON GROUP
        </p>

        <h1 className="font-serif text-4xl font-bold">
          Reset Password
        </h1>

        <form onSubmit={handleUpdate} className="mt-10 grid gap-5">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-[#1A1A1A]/20 px-4 py-3"
          />

          <button
            type="submit"
            className="bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            Update Password
          </button>

          {message && <p className="text-sm text-[#B19A55]">{message}</p>}
        </form>
      </section>
    </main>
  );
}