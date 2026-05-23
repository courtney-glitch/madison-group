"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { ClientMessages } from "@/components/ClientMessages";
import { AdminMessagesCenter } from "@/components/AdminMessagesCenter";

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    setLoggedIn(true);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    setIsAdmin(profile?.role === "admin" || user.email === "ronaviljoyc@gmail.com");

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
        <section className="mx-auto max-w-5xl rounded-[1.5rem] bg-white p-8 shadow-xl">
          <p className="font-serif text-2xl font-bold">Loading messages...</p>
        </section>
      </main>
    );
  }

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
        <section className="mx-auto max-w-5xl rounded-[1.5rem] bg-white p-8 shadow-xl">
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
            Messages
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold">
            Please login first.
          </h1>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-7xl">
        {isAdmin ? <AdminMessagesCenter /> : <ClientMessages />}
      </section>
    </main>
  );
}