"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email) {
      setEmail(user.email);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
        <p>Loading account...</p>
      </main>
    );
  }

  if (!email) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
        <section className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl font-bold">Please login</h1>

          <Link
            href="/login"
            className="mt-6 inline-block bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            Login
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-3xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          MY ACCOUNT
        </p>

        <h1 className="font-serif text-4xl font-bold">Welcome back</h1>

        <div className="mt-10 border border-[#1A1A1A]/10 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">
            Email
          </p>

          <p className="mt-2 font-serif text-2xl font-bold">{email}</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link
            href="/favorites"
            className="border border-[#1A1A1A]/10 p-6 font-serif text-xl font-bold hover:border-[#B19A55]"
          >
            Saved Homes
          </Link>

          <Link
            href="/properties"
            className="border border-[#1A1A1A]/10 p-6 font-serif text-xl font-bold hover:border-[#B19A55]"
          >
            Explore Homes
          </Link>
        </div>
      </section>
    </main>
  );
}