"use client";

import {
  CircleDollarSign,
  Heart,
  MessageCircle,
  Search,
  Users,
} from "lucide-react";

const clients = [
  {
    name: "Emily Carter",
    stage: "Active Search",
    favorites: 12,
    budget: "$950,000",
    unread: 2,
  },
  {
    name: "Michael Torres",
    stage: "Pre-Approved",
    favorites: 5,
    budget: "$1,200,000",
    unread: 0,
  },
  {
    name: "Sophia Nguyen",
    stage: "Offer Stage",
    favorites: 18,
    budget: "$850,000",
    unread: 4,
  },
];

export default function ClientsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
            <Users size={20} />
          </div>

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Admin View
            </p>

            <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
              All Clients
            </h1>
          </div>
        </div>

        <div className="mt-8 grid gap-4">
          {clients.map((client) => (
            <div
              key={client.name}
              className="rounded-[1.5rem] bg-white p-5 shadow-xl md:p-6"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-serif text-2xl font-bold">
                    {client.name}
                  </h2>

                  <p className="mt-2 text-sm text-[#B19A55]">
                    {client.stage}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="rounded-2xl bg-[#F8F5EF] px-4 py-3">
                    <div className="flex items-center gap-2 text-[#B19A55]">
                      <Heart size={15} />

                      <p className="text-[10px] uppercase tracking-[0.2em]">
                        Favorites
                      </p>
                    </div>

                    <p className="mt-2 font-serif text-xl font-bold">
                      {client.favorites}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F8F5EF] px-4 py-3">
                    <div className="flex items-center gap-2 text-[#B19A55]">
                      <CircleDollarSign size={15} />

                      <p className="text-[10px] uppercase tracking-[0.2em]">
                        Budget
                      </p>
                    </div>

                    <p className="mt-2 font-serif text-xl font-bold">
                      {client.budget}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F8F5EF] px-4 py-3">
                    <div className="flex items-center gap-2 text-[#B19A55]">
                      <MessageCircle size={15} />

                      <p className="text-[10px] uppercase tracking-[0.2em]">
                        Unread
                      </p>
                    </div>

                    <p className="mt-2 font-serif text-xl font-bold">
                      {client.unread}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-full bg-[#B19A55] px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  Open Profile
                </button>

                <button className="rounded-full border border-[#1A1A1A]/10 bg-white px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                  Send Message
                </button>

                <button className="rounded-full border border-[#1A1A1A]/10 bg-white px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">
                  View Activity
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}