"use client";

import {
  Bell,
  CalendarDays,
  MessageCircle,
  DollarSign,
  UserPlus,
} from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";

const notifications = [
  {
    title: "New Buyer Budget Submitted",
    description: "A buyer completed the budget calculator.",
    icon: DollarSign,
    time: "5 minutes ago",
  },
  {
    title: "New Showing Request",
    description: "A client requested a property tour.",
    icon: CalendarDays,
    time: "12 minutes ago",
  },
  {
    title: "New Chat Message",
    description: "Client sent a new message.",
    icon: MessageCircle,
    time: "18 minutes ago",
  },
  {
    title: "New Referral Submitted",
    description: "A referral was added to the pipeline.",
    icon: UserPlus,
    time: "1 hour ago",
  },
];

export default function NotificationsPage() {
  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 md:px-6 md:py-12">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <Bell size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Admin Control
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold text-[#1A1A1A] md:text-5xl">
                Notification Center
              </h1>
            </div>
          </div>

          <div className="grid gap-4">
            {notifications.map((notification) => {
              const Icon = notification.icon;

              return (
                <div
                  key={notification.title}
                  className="rounded-[2rem] bg-white p-6 shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                      <Icon size={20} />
                    </div>

                    <div className="flex-1">
                      <h2 className="font-serif text-xl font-bold text-[#1A1A1A]">
                        {notification.title}
                      </h2>

                      <p className="mt-2 text-sm text-[#1A1A1A]/65">
                        {notification.description}
                      </p>

                      <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[#B19A55]">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </AdminPageShell>
  );
}