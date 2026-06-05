import Link from "next/link";
import {
  BellRing,
  Building2,
  Link2,
  MessageCircle,
  Search,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function AdminDashboardPage() {
  const { count: clientCount } = await supabase
    .from("crm_clients")
    .select("*", { count: "exact", head: true });

  const { count: teamCount } = await supabase
    .from("team_members")
    .select("*", { count: "exact", head: true });

  const { count: linkCount } = await supabase
    .from("external_links")
    .select("*", { count: "exact", head: true });

  const { count: notificationCount } = await supabase
    .from("notification_events")
    .select("*", { count: "exact", head: true });

  const cards = [
    {
      title: "All Clients",
      value: clientCount || 0,
      href: "/admin/clients",
      icon: Users,
    },
    {
      title: "Team Members",
      value: teamCount || 0,
      href: "/admin/team",
      icon: Users,
    },
    {
      title: "External Links",
      value: linkCount || 0,
      href: "/admin/external-links",
      icon: Link2,
    },
    {
      title: "Notifications",
      value: notificationCount || 0,
      href: "/admin/push-notifications/history",
      icon: BellRing,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-7xl">
        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
            Agent View
          </p>

          <h1 className="mt-3 font-serif text-3xl font-bold md:text-5xl">
            Agent Dashboard
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#1A1A1A]/65 md:text-base">
            Manage clients, activity, messaging, links, notifications, and
            buyer engagement tools from one command center.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-[1.5rem] bg-white p-6 shadow-xl transition hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                  <Icon size={21} />
                </div>

                <p className="mt-5 font-serif text-4xl font-bold">
                  {card.value}
                </p>

                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/45">
                  {card.title}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <QuickLink
            href="/admin/client-activity"
            title="Client Activity"
            description="Review live buyer activity, AI scores, notes, and showing interest."
            icon={<Search size={20} />}
          />

          <QuickLink
            href="/admin/messages"
            title="Admin Messages"
            description="Open advisor-client conversations and respond to inquiries."
            icon={<MessageCircle size={20} />}
          />

          <QuickLink
            href="/admin/properties"
            title="Manage Properties"
            description="Add, edit, and organize property listings."
            icon={<Building2 size={20} />}
          />
        </div>
      </section>
    </main>
  );
}

function QuickLink({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className="rounded-[1.5rem] bg-white p-6 shadow-xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
        {icon}
      </div>

      <h2 className="mt-5 font-serif text-2xl font-bold">{title}</h2>

      <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/65">
        {description}
      </p>
    </Link>
  );
}