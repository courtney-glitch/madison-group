import Link from "next/link";
import { BellRing, History, Plus } from "lucide-react";

export default function PushNotificationsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <BellRing size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Agent View
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              Push Notifications
            </h1>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/push-notifications/create"
            className="rounded-[1.5rem] bg-white p-6 shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <Plus size={24} />
            </div>

            <h2 className="mt-6 font-serif text-2xl font-bold">
              Create New
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1A1A1A]/65">
              Create a new in-app notification for a client or buyer.
            </p>
          </Link>

          <Link
            href="/admin/push-notifications/history"
            className="rounded-[1.5rem] bg-white p-6 shadow-xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <History size={24} />
            </div>

            <h2 className="mt-6 font-serif text-2xl font-bold">
              History
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#1A1A1A]/65">
              Review sent notification records and client updates.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}