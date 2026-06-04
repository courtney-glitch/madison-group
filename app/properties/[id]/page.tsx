import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PropertyCard } from "@/components/PropertyCard";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShowingForm } from "@/components/ShowingForm";
import { PropertyMap } from "@/components/PropertyMap";
import { PropertyGallery } from "@/components/PropertyGallery";
import { TrackPropertyView } from "@/components/TrackPropertyView";
import { BuyerFinancialCenter } from "@/components/BuyerFinancialCenter";
import { PropertyNotes } from "@/components/PropertyNotes";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  const { data: galleryImages } = await supabase
    .from("property_gallery")
    .select("*")
    .eq("property_id", id)
    .order("created_at", { ascending: true });

  if (error || !property) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-6xl">
          <Link href="/properties" className="font-serif text-sm text-[#B19A55]">
            ← Back to Home Search
          </Link>

          <h1 className="mt-8 font-serif text-4xl font-bold md:text-5xl">
            Home not found
          </h1>
        </section>
      </main>
    );
  }

  const allImages = [
    ...(property.image ? [{ id: "main", image_url: property.image }] : []),
    ...(galleryImages || []),
  ];

  const details = [
    { label: "Beds", value: property.beds },
    { label: "Baths", value: property.baths },
    {
      label: "Square Feet",
      value: property.sqft ? property.sqft.toLocaleString() : null,
    },
    { label: "Property Type", value: property.property_type },
    { label: "Year Built", value: property.year_built },
    { label: "Garage", value: property.garage },
    { label: "Lot Size", value: property.lot_size },
    { label: "Taxes", value: property.taxes },
    { label: "School District", value: property.school_district },
  ].filter((item) => item.value);

  const { data: similarHomes } = await supabase
    .from("properties")
    .select("*")
    .eq("city", property.city)
    .neq("id", property.id)
    .limit(3);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8F5EF] text-[#1A1A1A]">
      <TrackPropertyView propertyId={property.id} />

      <section className="bg-[#1A1A1A] px-4 pb-8 pt-10 text-white md:px-6 md:pb-16 md:pt-12">
        <div className="mx-auto max-w-7xl">
          <Link href="/properties" className="font-serif text-xs text-[#D4B06A] md:text-sm">
            ← Back to Home Search
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.42fr] lg:items-end">
            <div>
              <p className="font-serif text-[10px] uppercase tracking-[0.25em] text-[#D4B06A] md:text-sm md:tracking-[0.35em]">
                {property.city}, New Jersey
              </p>

              <h1 className="mt-3 max-w-5xl font-serif text-3xl font-bold leading-tight md:mt-5 md:text-6xl">
                {property.title}
              </h1>

              {(property.address || property.zip_code) && (
                <p className="mt-4 text-sm leading-7 text-white/65 md:mt-6 md:text-lg">
                  {property.address && `${property.address}, `}
                  {property.city}, NJ {property.zip_code}
                </p>
              )}
            </div>

            <div className="lg:text-right">
              {property.status && (
                <p className="mb-3 inline-block rounded-full bg-[#B19A55] px-4 py-2 font-serif text-[10px] font-bold uppercase tracking-[0.18em] text-white md:mb-4 md:px-5 md:text-xs">
                  {property.status}
                </p>
              )}

              <p className="font-serif text-3xl font-bold text-[#D4B06A] md:text-5xl">
                {property.price}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-10">
        <PropertyGallery images={allImages} title={property.title} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.38fr] lg:gap-10">
          <section className="min-w-0">
            <div className="grid grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-4">
              <CompactStat label="Beds" value={property.beds || "—"} />
              <CompactStat label="Baths" value={property.baths || "—"} />
              <CompactStat
                label="Sq Ft"
                value={property.sqft ? property.sqft.toLocaleString() : "—"}
              />
              <CompactStat label="Type" value={property.property_type || "Home"} />
            </div>

            <section className="py-8 md:py-16">
              <p className="mb-3 font-serif text-[10px] uppercase tracking-[0.25em] text-[#B19A55] md:text-sm md:tracking-[0.35em]">
                Property Overview
              </p>

              <h2 className="max-w-4xl font-serif text-3xl font-bold leading-tight md:text-5xl">
                Elevated living in {property.city}.
              </h2>

              <p className="mt-5 max-w-4xl text-base leading-8 text-[#1A1A1A]/72 md:mt-8 md:text-xl md:leading-10">
                {property.description}
              </p>
            </section>

            {details.length > 0 && (
              <section className="border-t border-[#1A1A1A]/10 py-8 md:py-16">
                <p className="mb-4 font-serif text-[10px] uppercase tracking-[0.25em] text-[#B19A55] md:text-sm md:tracking-[0.35em]">
                  Property Details
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 md:mt-10 md:gap-5 lg:grid-cols-3">
                  {details.map((detail) => (
                    <div
                      key={detail.label}
                      className="min-w-0 rounded-2xl border border-[#1A1A1A]/10 bg-white p-4 shadow-sm md:p-7"
                    >
                      <p className="text-[9px] uppercase tracking-[0.16em] text-[#1A1A1A]/50 md:text-sm md:tracking-[0.2em]">
                        {detail.label}
                      </p>

                      <p className="mt-2 break-words font-serif text-base font-bold md:mt-3 md:text-2xl">
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="border-t border-[#1A1A1A]/10 py-8 md:py-16">
              <BuyerFinancialCenter price={property.price} />
            </section>

            <section className="border-t border-[#1A1A1A]/10 py-8 md:py-16">
              <p className="mb-3 font-serif text-[10px] uppercase tracking-[0.25em] text-[#B19A55] md:text-sm md:tracking-[0.35em]">
                Location
              </p>

              <h2 className="font-serif text-3xl font-bold md:text-4xl">
                Explore {property.city}
              </h2>

              <div className="mt-5 overflow-hidden rounded-2xl md:mt-8">
                <PropertyMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  city={property.city}
                  address={property.address}
                  zipCode={property.zip_code}
                />
              </div>
            </section>
          </section>

          <aside className="grid h-fit gap-4 lg:sticky lg:top-28 lg:gap-6">
            <div className="rounded-2xl bg-white p-4 shadow-xl md:p-8">
              <p className="font-serif text-[10px] uppercase tracking-[0.25em] text-[#B19A55] md:text-sm md:tracking-[0.35em]">
                Private Tour
              </p>

              <h2 className="mt-3 font-serif text-2xl font-bold leading-tight md:mt-4 md:text-4xl">
                Schedule a private showing.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#1A1A1A]/70 md:mt-5 md:leading-8">
                Request a tour and a Madison Group advisor will follow up with
                availability, next steps, and local guidance.
              </p>

              <div className="mt-5 grid gap-3 md:mt-8 md:gap-4">
                <Link
                  href="#showing"
                  className="rounded-full bg-[#B19A55] px-5 py-3 text-center font-serif text-[10px] font-bold uppercase tracking-[0.18em] text-white md:px-8 md:py-4 md:text-sm"
                >
                  Request Showing
                </Link>

                <FavoriteButton propertyId={property.id} />
              </div>
            </div>

            <PropertyNotes propertyId={property.id} />
          </aside>
        </div>
      </section>

      <section id="showing" className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-16">
        <div className="rounded-2xl bg-white p-4 shadow-xl md:p-8">
          <ShowingForm propertyId={property.id} />
        </div>
      </section>

      {similarHomes && similarHomes.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-20">
          <div className="flex flex-col gap-4 border-t border-[#1A1A1A]/10 pt-8 md:flex-row md:items-end md:justify-between md:pt-14">
            <div>
              <p className="font-serif text-[10px] uppercase tracking-[0.25em] text-[#B19A55] md:text-sm md:tracking-[0.35em]">
                Similar Homes
              </p>

              <h2 className="mt-2 font-serif text-3xl font-bold md:mt-3 md:text-5xl">
                More homes in {property.city}
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-10 md:grid-cols-3 md:gap-8">
            {similarHomes.map((home) => (
              <PropertyCard
                key={home.id}
                id={home.id}
                title={home.title}
                city={home.city}
                price={home.price}
                beds={home.beds}
                baths={home.baths}
                image={home.image}
                status={home.status}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function CompactStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="min-w-0 border-b border-r border-[#1A1A1A]/10 p-4 last:border-r-0 md:p-6">
      <p className="text-[9px] uppercase tracking-[0.16em] text-[#1A1A1A]/50 md:text-xs md:tracking-[0.22em]">
        {label}
      </p>

      <p className="mt-2 truncate font-serif text-xl font-bold md:text-3xl">
        {value}
      </p>
    </div>
  );
}