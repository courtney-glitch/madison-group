"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (data?.role === "admin") {
      setAuthorized(true);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-12">
        <p>Loading...</p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
        <h1 className="font-serif text-4xl font-bold">Access Denied</h1>
        <p className="mt-4">You do not have admin access.</p>
      </main>
    );
  }

  const adminLinks = [
    {
      title: "Manage Properties",
      href: "/admin/properties",
      description: "Add, edit, delete, and manage property listings.",
    },
    {
      title: "Add Property",
      href: "/admin/properties/new",
      description: "Create a new listing with uploaded images.",
    },
    {
      title: "Showing Requests",
      href: "/admin/leads",
      description: "Review showing requests and update lead status.",
    },
    {
      title: "Buyer Inquiries",
      href: "/admin/inquiries",
      description: "View buyer inquiry details, contact info, and messages.",
    },
    {
      title: "Manage Agents",
      href: "/admin/agents",
      description: "Add and manage team members and agent profiles.",
    },
    {
      title: "Company Settings",
      href: "/admin/settings",
      description: "Manage notification email and company details.",
    },
  ];

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-6xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          ADMIN DASHBOARD
        </p>

        <h1 className="font-serif text-4xl font-bold md:text-6xl">
          Madison Group Admin
        </h1>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="border border-[#1A1A1A]/10 p-6 transition hover:border-[#B19A55] hover:shadow-xl"
            >
              <h2 className="font-serif text-2xl font-bold">{link.title}</h2>

              <p className="mt-3 text-[#1A1A1A]/70">{link.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}