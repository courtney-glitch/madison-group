import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Scale, Star, Heart, Home } from "lucide-react";

function money(value: string | number | null) {
  if (!value) return "—";

  if (typeof value === "string") return value;

  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default async function ComparePage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
        <section className="mx-auto max-w-5xl rounded-[1.5rem] bg-white p-8 shadow-xl">
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
            Property Compare
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold">
            Please login first.
          </h1>

          <p className="mt-4 text-[#1A1A1A]/60">
            Login to compare your saved and rated homes.
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

  const { data: notes } = await supabase
    .from("property_notes")
    .select(
      `
      id,
      rating,
      note,
      properties (
        id,
        title,
        city,
        price,
        beds,
        baths,
        sqft,
        property_type,
        taxes,
        image,
        status
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const { data: favorites } = await supabase
    .from("favorites")
    .select(
      `
      id,
      properties (
        id,
        title,
        city,
        price,
        beds,
        baths,
        sqft,
        property_type,
        taxes,
        image,
        status
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const compareItems =
    notes && notes.length > 0 ? notes : favorites || [];

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Buyer Decision Center
            </p>

            <h1 className="mt-3 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-tight">
              Compare Homes
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-[#1A1A1A]/65">
              Review your saved and rated homes side-by-side to make clearer,
              more confident buying decisions.
            </p>
          </div>

          <Link
            href="/properties"
            className="rounded-full bg-[#B19A55] px-7 py-4 text-center font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749]"
          >
            Browse Homes
          </Link>
        </div>

        {compareItems.length === 0 ? (
          <section className="mt-10 rounded-[1.5rem] bg-white p-8 shadow-xl">
            <div className="flex items-center gap-3">
              <Scale className="text-[#B19A55]" />

              <h2 className="font-serif text-2xl font-bold">
                Nothing to compare yet.
              </h2>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#1A1A1A]/60">
              Save homes or add ratings/notes on property pages first. Your
              comparison board will automatically build from those homes.
            </p>

            <Link
              href="/properties"
              className="mt-8 inline-block rounded-full bg-[#B19A55] px-7 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
            >
              Start Searching
            </Link>
          </section>
        ) : (
          <section className="mt-10 overflow-hidden rounded-[1.5rem] bg-white shadow-xl">
            <div className="border-b border-[#1A1A1A]/10 p-6">
              <div className="flex items-center gap-3">
                <Scale className="text-[#B19A55]" />

                <h2 className="font-serif text-2xl font-bold">
                  Side-by-Side Comparison
                </h2>
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-3">
              {compareItems.map((item: any) => {
                const property = item.properties;

                if (!property) return null;

                return (
                  <div
                    key={item.id}
                    className="border-b border-[#1A1A1A]/10 p-6 lg:border-b-0 lg:border-r last:lg:border-r-0"
                  >
                    <div className="overflow-hidden rounded-3xl bg-[#F8F5EF]">
                      {property.image ? (
                        <img
                          src={property.image}
                          alt={property.title}
                          className="h-56 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-56 items-center justify-center bg-[#1A1A1A] text-white">
                          Image Coming Soon
                        </div>
                      )}

                      <div className="p-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#B19A55]">
                          {property.city}, NJ
                        </p>

                        <h3 className="mt-3 font-serif text-2xl font-bold leading-tight">
                          {property.title}
                        </h3>

                        <p className="mt-4 font-serif text-2xl font-bold text-[#B19A55]">
                          {money(property.price)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3">
                      <CompareRow label="Beds" value={property.beds || "—"} />
                      <CompareRow label="Baths" value={property.baths || "—"} />
                      <CompareRow
                        label="Sq Ft"
                        value={
                          property.sqft
                            ? property.sqft.toLocaleString()
                            : "—"
                        }
                      />
                      <CompareRow
                        label="Type"
                        value={property.property_type || "—"}
                      />
                      <CompareRow label="Taxes" value={property.taxes || "—"} />
                      <CompareRow
                        label="Status"
                        value={property.status || "—"}
                      />
                    </div>

                    {"rating" in item && (
                      <div className="mt-6 rounded-3xl bg-[#F8F5EF] p-5">
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              fill={
                                star <= item.rating ? "currentColor" : "none"
                              }
                              className={
                                star <= item.rating
                                  ? "text-[#B19A55]"
                                  : "text-[#1A1A1A]/20"
                              }
                            />
                          ))}
                        </div>

                        {item.note && (
                          <p className="mt-4 text-sm leading-7 text-[#1A1A1A]/65">
                            {item.note}
                          </p>
                        )}
                      </div>
                    )}

                    <Link
                      href={`/properties/${property.id}`}
                      className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#B19A55]"
                    >
                      <Home size={15} />
                      View Home
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-10 rounded-[1.5rem] bg-[#1A1A1A] p-8 text-white shadow-xl">
          <div className="flex items-center gap-3">
            <Heart className="text-[#D4B06A]" />

            <h2 className="font-serif text-2xl font-bold">
              How to Build Your Compare Board
            </h2>
          </div>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/65">
            Save homes, add notes, or rate properties from individual property
            pages. Madison Group will keep your decision history organized here.
          </p>
        </section>
      </section>
    </main>
  );
}

function CompareRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#1A1A1A]/10 pb-3">
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/45">
        {label}
      </span>

      <strong className="text-right font-serif text-base">{value}</strong>
    </div>
  );
}