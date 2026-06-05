"use client";

import { BellRing } from "lucide-react";

const history = [
  {
    title: "New Bergen County Listings",
    audience: "All Users",
    date: "Today",
  },
  {
    title: "Open House Weekend Reminder",
    audience: "Clients",
    date: "Yesterday",
  },
];

export default function NotificationHistoryPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 md:px-6 md:py-12">
      <section className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <BellRing size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Push Notifications
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              Notification History
            </h1>
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {history.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] bg-white p-6 shadow-xl"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#B19A55]">
                {item.audience}
              </p>

              <h2 className="mt-3 font-serif text-2xl font-bold">
                {item.title}
              </h2>

              <p className="mt-3 text-sm text-[#1A1A1A]/60">
                Sent {item.date}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}