"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { getCurrentUserRole, canAccessAdmin } from "@/lib/userRole";

type AdminGuardProps = {
  children: React.ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    const role = await getCurrentUserRole();

    setAllowed(canAccessAdmin(role));
    setChecking(false);
  }

  if (checking) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A]">
        <p className="font-serif text-2xl font-bold">Checking access...</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A]">
        <section className="mx-auto max-w-3xl rounded-[1.5rem] bg-white p-6 shadow-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
            <ShieldAlert size={22} />
          </div>

          <h1 className="mt-5 font-serif text-3xl font-bold">
            Admin Access Required
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#1A1A1A]/65">
            You do not have permission to view this admin area.
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-block rounded-full bg-[#B19A55] px-6 py-3 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
          >
            Go to Dashboard
          </Link>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}