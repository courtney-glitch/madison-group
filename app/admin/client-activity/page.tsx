import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  Activity,
  Calculator,
  CalendarDays,
  Heart,
  MessageCircle,
  MessageSquareText,
  Star,
} from "lucide-react";

function money(value: number | null) {
  if (!value) return "$0";

  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default async function ClientActivityPage() {
  const { data: budgets } = await supabase
    .from("buyer_budgets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: showingRequests } = await supabase
    .from("showing_requests")
    .select(
      `
      id,
      user_id,
      full_name,
      email,
      phone,
      message,
      created_at,
      properties (
        id,
        title,
        city,
        price
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: notes } = await supabase
    .from("property_notes")
    .select(
      `
      id,
      user_id,
      rating,
      note,
      created_at,
      properties (
        id,
        title,
        city,
        price
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: messages } = await supabase
    .from("messages")
    .select(
      `
      id,
      sender_type,
      message,
      created_at,
      conversations (
        id,
        user_id
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Madison Group Admin
            </p>

            <h1 className="mt-3 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-tight">
              Client Activity
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-[#1A1A1A]/65">
              Monitor buyer activity, saved budgets, showing requests, notes,
              ratings, and client messages.
            </p>
          </div>

          <Link
            href="/admin/properties"
            className="rounded-full bg-[#B19A55] px-7 py-4 text-center font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749]"
          >
            Manage Properties
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          <AdminStat
            icon={<Calculator size={18} />}
            label="Buyer Budgets"
            value={budgets?.length || 0}
          />

          <AdminStat
            icon={<CalendarDays size={18} />}
            label="Showings"
            value={showingRequests?.length || 0}
          />

          <AdminStat
            icon={<MessageSquareText size={18} />}
            label="Notes"
            value={notes?.length || 0}
          />

          <AdminStat
            icon={<MessageCircle size={18} />}
            label="Messages"
            value={messages?.length || 0}
          />
        </div>

        <section className="mt-10 rounded-[1.5rem] bg-white p-6 shadow-xl">
          <SectionTitle
            icon={<Calculator size={20} />}
            title="Recent Buyer Budgets"
          />

          <div className="mt-6 grid gap-4">
            {budgets && budgets.length > 0 ? (
              budgets.map((budget: any) => (
                <div
                  key={budget.id}
                  className="grid gap-4 rounded-3xl bg-[#F8F5EF] p-5 md:grid-cols-4"
                >
                  <InfoSmall
                    label="User"
                    value={budget.user_id?.slice(0, 8) || "Unknown"}
                  />

                  <InfoSmall
                    label="Home Budget"
                    value={money(budget.estimated_home_price)}
                  />

                  <InfoSmall
                    label="Monthly Payment"
                    value={money(budget.estimated_monthly_payment)}
                  />

                  <InfoSmall
                    label="Savings"
                    value={money(budget.savings)}
                  />
                </div>
              ))
            ) : (
              <EmptyText text="No saved buyer budgets yet." />
            )}
          </div>
        </section>

        <section className="mt-10 rounded-[1.5rem] bg-white p-6 shadow-xl">
          <SectionTitle
            icon={<CalendarDays size={20} />}
            title="Showing Requests"
          />

          <div className="mt-6 grid gap-4">
            {showingRequests && showingRequests.length > 0 ? (
              showingRequests.map((request: any) => (
                <div
                  key={request.id}
                  className="rounded-3xl bg-[#F8F5EF] p-5"
                >
                  <div className="grid gap-4 md:grid-cols-3">
                    <InfoSmall
                      label="Client"
                      value={request.full_name || "Unknown"}
                    />

                    <InfoSmall
                      label="Property"
                      value={request.properties?.title || "Property"}
                    />

                    <InfoSmall
                      label="Email"
                      value={request.email || "—"}
                    />
                  </div>

                  {request.message && (
                    <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-7 text-[#1A1A1A]/65">
                      {request.message}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <EmptyText text="No showing requests yet." />
            )}
          </div>
        </section>

        <section className="mt-10 rounded-[1.5rem] bg-white p-6 shadow-xl">
          <SectionTitle
            icon={<Star size={20} />}
            title="Buyer Notes & Ratings"
          />

          <div className="mt-6 grid gap-4">
            {notes && notes.length > 0 ? (
              notes.map((note: any) => (
                <div
                  key={note.id}
                  className="rounded-3xl bg-[#F8F5EF] p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#B19A55]">
                        {note.properties?.title || "Property"}
                      </p>

                      <p className="mt-2 text-sm text-[#1A1A1A]/60">
                        User: {note.user_id?.slice(0, 8)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`rounded-full p-2 ${
                            star <= note.rating
                              ? "bg-[#B19A55] text-white"
                              : "bg-white text-[#1A1A1A]/20"
                          }`}
                        >
                          <Star size={15} fill={star <= note.rating ? "currentColor" : "none"} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {note.note && (
                    <p className="mt-4 rounded-2xl bg-white p-4 text-sm leading-7 text-[#1A1A1A]/65">
                      {note.note}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <EmptyText text="No buyer notes yet." />
            )}
          </div>
        </section>

        <section className="mt-10 rounded-[1.5rem] bg-white p-6 shadow-xl">
          <SectionTitle
            icon={<MessageCircle size={20} />}
            title="Recent Messages"
          />

          <div className="mt-6 grid gap-4">
            {messages && messages.length > 0 ? (
              messages.map((message: any) => (
                <div
                  key={message.id}
                  className="rounded-3xl bg-[#F8F5EF] p-5"
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#B19A55]">
                    {message.sender_type}
                  </p>

                  <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/70">
                    {message.message}
                  </p>

                  <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/35">
                    User: {message.conversations?.user_id?.slice(0, 8)}
                  </p>
                </div>
              ))
            ) : (
              <EmptyText text="No messages yet." />
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function AdminStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
      <div className="text-[#B19A55]">{icon}</div>

      <p className="mt-4 font-serif text-3xl font-bold">{value}</p>

      <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/45">
        {label}
      </p>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[#B19A55]">{icon}</div>

      <h2 className="font-serif text-2xl font-bold">{title}</h2>
    </div>
  );
}

function InfoSmall({ label, value }: { label: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/45">
        {label}
      </p>

      <p className="mt-2 font-serif text-lg font-bold">{value}</p>
    </div>
  );
}

function EmptyText({ text }: { text: string }) {
  return (
    <p className="rounded-3xl bg-[#F8F5EF] p-6 text-sm text-[#1A1A1A]/60">
      {text}
    </p>
  );
}