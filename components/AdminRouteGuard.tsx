"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setAllowed(false);
      setChecking(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const role = profile?.role || "client";

    setAllowed(role === "admin" || role === "agent");
    setChecking(false);
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-20 text-center text-sm text-[#1A1A1A]/60">
        Checking access...
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-20 text-center">
        <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <ShieldAlert size={24} />
          </div>

          <h1 className="mt-6 font-serif text-3xl font-bold text-[#1A1A1A]">
            Admin Access Required
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#1A1A1A]/60">
            This area is only available to Madison admin and advisor accounts.
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}