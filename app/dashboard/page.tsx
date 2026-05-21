import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PropertyCard } from "@/components/PropertyCard";
import {
  LayoutDashboard,
  Heart,
  Calculator,
  CalendarDays,
  Search,
  TrendingUp,
} from "lucide-react";

function money(value: number | null) {
  if (!value) return "$0";

  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default async function DashboardPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
        <section className="mx-auto max-w-5xl rounded-[1.5rem] bg-white p-8 shadow-xl">
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
            Client Dashboard
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold">
            Please login first.
          </h1>

          <p className="mt-4 text-[#1A1A1A]/60">
            Login to view your saved homes, budgets, searches, and activity.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-block rounded-full bg-[#B19A55] px-8 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
          >
            Login
          </Link>
        </section>
      </main>
    );
  }

  const { data: budgets } = await supabase
    .from("buyer_budgets")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: favorites } = await supabase
    .from("favorites")
    .select(
      `
      id,
      property_id,
      properties (
        id,
        title,
        city,
        price,
        beds,
        baths,
        image,
        status
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const latestBudget = budgets?.[0];

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Madison Group Client Portal
            </p>

            <h1 className="mt-3 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-tight">
              Welcome back.
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-[#1A1A1A]/65">
              Your saved homes, budgets, searches, and buyer activity are kept
              together in one private dashboard.
            </p>
          </div>

          <Link
            href="/budget-calculator"
            className="rounded-full bg-[#B19A55] px-7 py-4 text-center font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749]"
          >
            Update Budget
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-4">
          <DashboardStat
            icon={<Calculator size={18} />}
            label="Saved Budgets"
            value={budgets?.length || 0}
          />

          <DashboardStat
            icon={<Heart size={18} />}
            label="Saved Homes"
            value={favorites?.length || 0}
          />

          <DashboardStat icon={<Search size={18} />} label="Saved Searches" value={0} />

          <DashboardStat
            icon={<CalendarDays size={18} />}
            label="Showing Requests"
            value={0}
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[1.5rem] bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <Calculator className="text-[#B19A55]" />

              <h2 className="font-serif text-2xl font-bold">
                Latest Buyer Budget
              </h2>
            </div>

            {latestBudget ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <InfoCard
                  label="Estimated Home Budget"
                  value={money(latestBudget.estimated_home_price)}
                />

                <InfoCard
                  label="Estimated Monthly Payment"
                  value={money(latestBudget.estimated_monthly_payment)}
                />

                <InfoCard
                  label="Annual Income"
                  value={money(latestBudget.annual_income)}
                />

                <InfoCard label="Savings" value={money(latestBudget.savings)} />
              </div>
            ) : (
              <div className="mt-8 rounded-3xl bg-[#F8F5EF] p-8">
                <p className="font-serif text-2xl font-bold">
                  No budget saved yet.
                </p>

                <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/60">
                  Start by using the Budget Calculator and save your first buyer
                  profile.
                </p>

                <Link
                  href="/budget-calculator"
                  className="mt-6 inline-block rounded-full bg-[#B19A55] px-6 py-3 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  Create Budget
                </Link>
              </div>
            )}
          </section>

          <section className="rounded-[1.5rem] bg-[#1A1A1A] p-6 text-white shadow-xl">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-[#D4B06A]" />

              <h2 className="font-serif text-2xl font-bold">
                Buyer Readiness
              </h2>
            </div>

            <div className="mt-8 rounded-3xl bg-white/10 p-6">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                Current Status
              </p>

              <p className="mt-4 font-serif text-4xl font-bold text-[#D4B06A]">
                {latestBudget ? "Active" : "Not Started"}
              </p>

              <p className="mt-4 text-sm leading-7 text-white/65">
                {latestBudget
                  ? "Your financial profile is saved. Next step is matching homes to your budget."
                  : "Save a budget to start building your private buyer profile."}
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <Link
                href="/properties"
                className="rounded-full bg-[#D4B06A] px-6 py-4 text-center font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
              >
                Browse Homes
              </Link>

              <Link
                href="/contact"
                className="rounded-full border border-white/20 px-6 py-4 text-center font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white/80"
              >
                Talk to Advisor
              </Link>
            </div>
          </section>
        </div>

        <section className="mt-10 rounded-[1.5rem] bg-white p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <Heart className="text-[#B19A55]" />

            <h2 className="font-serif text-2xl font-bold">Saved Homes</h2>
          </div>

          {favorites && favorites.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {favorites.map((favorite: any) => {
                const property = favorite.properties;

                if (!property) return null;

                return (
                  <PropertyCard
                    key={favorite.id}
                    id={property.id}
                    title={property.title}
                    city={property.city}
                    price={property.price}
                    beds={property.beds}
                    baths={property.baths}
                    image={property.image}
                    status={property.status}
                  />
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl bg-[#F8F5EF] p-8">
              <p className="font-serif text-2xl font-bold">
                No saved homes yet.
              </p>

              <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/60">
                Start saving homes from the Home Search page so they appear
                here in your private dashboard.
              </p>

              <Link
                href="/properties"
                className="mt-6 inline-block rounded-full bg-[#B19A55] px-6 py-3 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
              >
                Browse Homes
              </Link>
            </div>
          )}
        </section>

        <section className="mt-10 rounded-[1.5rem] bg-white p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-[#B19A55]" />

            <h2 className="font-serif text-2xl font-bold">
              Saved Budget History
            </h2>
          </div>

          <div className="mt-6 grid gap-4">
            {budgets && budgets.length > 0 ? (
              budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="grid gap-4 rounded-3xl border border-[#1A1A1A]/10 bg-[#F8F5EF] p-5 md:grid-cols-4"
                >
                  <InfoSmall
                    label="Home Budget"
                    value={money(budget.estimated_home_price)}
                  />

                  <InfoSmall
                    label="Monthly Payment"
                    value={money(budget.estimated_monthly_payment)}
                  />

                  <InfoSmall
                    label="Income"
                    value={money(budget.annual_income)}
                  />

                  <InfoSmall label="Savings" value={money(budget.savings)} />
                </div>
              ))
            ) : (
              <p className="rounded-3xl bg-[#F8F5EF] p-6 text-sm text-[#1A1A1A]/60">
                No saved budgets yet.
              </p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function DashboardStat({
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
      <div className="flex items-center gap-3 text-[#B19A55]">{icon}</div>

      <p className="mt-4 font-serif text-3xl font-bold">{value}</p>

      <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/45">
        {label}
      </p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-[#F8F5EF] p-6">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/45">
        {label}
      </p>

      <p className="mt-3 font-serif text-2xl font-bold">{value}</p>
    </div>
  );
}

function InfoSmall({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/45">
        {label}
      </p>

      <p className="mt-2 font-serif text-xl font-bold">{value}</p>
    </div>
  );
}