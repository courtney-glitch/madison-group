"use client";

import { CheckCircle, AlertCircle } from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";

const checks = [
  "Authentication",
  "Role Protection",
  "Property Search",
  "Property Details",
  "Favorites",
  "Saved Searches",
  "Buyer Budget Calculator",
  "Buyer Readiness",
  "Live Chat",
  "Referral Dashboard",
  "Transaction Pipeline",
  "Seller Dashboard",
  "Seller Timeline",
  "Seller Analytics",
  "Notification Center",
  "Global Settings",
  "Admin Dashboard",
  "Client Activity",
];

export default function SystemStatusPage() {
  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] p-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-serif text-5xl font-bold">
            Launch Readiness
          </h1>

          <div className="mt-8 grid gap-4">
            {checks.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-3xl bg-white p-5 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} />
                  <span>{item}</span>
                </div>

                <span className="text-xs uppercase tracking-widest text-[#B19A55]">
                  Verify
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </AdminPageShell>
  );
}