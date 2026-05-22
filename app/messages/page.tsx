"use client";

import { useEffect, useState } from "react";
import { AdminMessagesCenter } from "@/components/AdminMessagesCenter";
import { ClientMessages } from "@/components/ClientMessages";
import { supabase } from "@/lib/supabase";

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkRole();
  }, []);

  async function checkRole() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const adminByRole = profile?.role === "admin";
    const adminByEmail = user.email === "ronaviljoyc@gmail.com";

    setIsAdmin(adminByRole || adminByEmail);
    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
        <section className="mx-auto max-w-6xl rounded-[1.5rem] bg-white p-8 shadow-xl">
          <p className="font-serif text-2xl font-bold">Loading messages...</p>
        </section>
      </main>
    );
  }

  if (isAdmin) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
        <section className="mx-auto max-w-7xl">
          <AdminMessagesCenter />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-5xl">
        <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
          Client Communication
        </p>

        <h1 className="mt-3 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-tight">
          Messages
        </h1>

        <p className="mt-5 max-w-3xl text-base leading-8 text-[#1A1A1A]/65">
          Message your Madison Group advisor, review replies, and keep your
          buying conversation organized in one place.
        </p>

        <div className="mt-10">
          <ClientMessages />
        </div>
      </section>
    </main>
  );
}