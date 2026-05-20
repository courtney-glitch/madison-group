import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShowingForm } from "@/components/ShowingForm";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import { PropertyMap } from "@/components/PropertyMap";
import { PropertyGallery } from "@/components/PropertyGallery";
import { TrackPropertyView } from "@/components/TrackPropertyView";

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
    .from("property_images")
    .select("*")
    .eq("property_id", id)
    .order("created_at", { ascending: true });

  if (error || !property) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
        <section className="mx-auto max-w-6xl">
          <Link href="/properties" className="font-serif text-sm text-[#B19A55]">
            ← Back to Home Search
          </Link>

          <h1 className="mt-8 font-serif text-5xl font-bold">
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
    <main className="min-h-screen bg-[#F8F5EF] text-[#1A1A1A]">
      <TrackPropertyView propertyId={property.id} />

      <section className="bg-[#1A1A1A] px-6 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <Link href="/properties" className="font-serif text-sm text-[#D4B06A]">
            ← Back to Home Search
          </Link>
        </div>
      </section>

      <section className="bg-[#1A1A1A] px-6 pb-16 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.42fr] lg:items-end">
            <div>
              <p className="font-serif text-sm tracking-[0.35em] text-[#D4B06A]">
                {property.city}, NEW JERSEY
              </p>

              <h1 className="mt-5 max-w-5xl font-serif text-5xl font-bold leading-tight md:text-7xl">
                {property.title}
              </h1>

              {(property.address || property.zip_code) && (
                <p className="mt-6 text-lg text-white/65">
                  {property.address && `${property.address}, `}
                  {property.city}, NJ {property.zip_code}
                </p>
              )}
            </div>

            <div className="lg:text-right">
              {property.status && (
                <p className="mb-4 inline-block bg-[#B19A55] px-5 py-2 font-serif text-xs font-bold uppercase tracking-[0.25em] text-white">
                  {property.status}
                </p>
              )}

              <p className="font-serif text-5xl font-bold text-[#D4B06A]">
                {property.price}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <PropertyGallery images={allImages} title={property.title} />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.38fr]">
          <section>
            <div className="grid border-y border-[#1A1A1A]/10 bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-8">
                <p className="text-sm uppercase tracking-[0.25em] text-[#1A1A1A]/50">
                  Beds
                </p>
                <p className="mt-3 font-serif text-4xl font-bold">
                  {property.beds}
                </p>
              </div>

              <div className="border-t border-[#1A1A1A]/10 p-8 sm:border-l sm:border-t-0">
                <p className="text-sm uppercase tracking-[0.25em] text-[#1A1A1A]/50">
                  Baths
                </p>
                <p className="mt-3 font-serif text-4xl font-bold">
                  {property.baths}
                </p>
              </div>

              <div className="border-t border-[#1A1A1A]/10 p-8 lg:border-l lg:border-t-0">
                <p className="text-sm uppercase tracking-[0.25em] text-[#1A1A1A]/50">
                  Sq Ft
                </p>
                <p className="mt-3 font-serif text-4xl font-bold">
                  {property.sqft ? property.sqft.toLocaleString() : "—"}
                </p>
              </div>

              <div className="border-t border-[#1A1A1A]/10 p-8 lg:border-l lg:border-t-0">
                <p className="text-sm uppercase tracking-[0.25em] text-[#1A1A1A]/50">
                  Type
                </p>
                <p className="mt-3 font-serif text-3xl font-bold">
                  {property.property_type || "Home"}
                </p>
              </div>
            </div>

            <section className="py-16">
              <p className="mb-4 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
                PROPERTY OVERVIEW
              </p>

              <h2 className="max-w-4xl font-serif text-5xl font-bold leading-tight">
                Elevated living in {property.city}.
              </h2>

              <p className="mt-8 max-w-4xl text-xl leading-10 text-[#1A1A1A]/72">
                {property.description}
              </p>
            </section>

            {details.length > 0 && (
              <section className="border-t border-[#1A1A1A]/10 py-16">
                <p className="mb-4 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
                  PROPERTY DETAILS
                </p>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {details.map((detail) => (
                    <div
                      key={detail.label}
                      className="border border-[#1A1A1A]/10 bg-white p-7 shadow-sm"
                    >
                      <p className="text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                        {detail.label}
                      </p>

                      <p className="mt-3 font-serif text-2xl font-bold">
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="border-t border-[#1A1A1A]/10 py-16">
              <MortgageCalculator price={property.price} />
            </section>

            <section className="border-t border-[#1A1A1A]/10 py-16">
              <p className="mb-4 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
                LOCATION
              </p>

              <h2 className="font-serif text-4xl font-bold">
                Explore {property.city}
              </h2>

              <div className="mt-8">
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

          <aside className="h-fit bg-white p-8 shadow-2xl lg:sticky lg:top-28">
            <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
              PRIVATE TOUR
            </p>

            <h2 className="mt-4 font-serif text-4xl font-bold leading-tight">
              Schedule a private showing.
            </h2>

            <p className="mt-5 leading-8 text-[#1A1A1A]/70">
              Request a tour and a Madison Group advisor will follow up with
              availability, next steps, and local guidance.
            </p>

            <div className="mt-8 grid gap-4">
              <Link
                href="#showing"
                className="bg-[#B19A55] px-8 py-4 text-center font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
              >
                Request Showing
              </Link>

              <FavoriteButton propertyId={property.id} />
            </div>

            <div className="mt-8 border-t border-[#1A1A1A]/10 pt-8">
              <p className="font-serif text-xl font-bold">
                Madison Group Properties
              </p>

              <p className="mt-3 leading-7 text-[#1A1A1A]/65">
                Bergen County luxury guidance with calm, transparent advocacy.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section id="showing" className="mx-auto max-w-4xl px-6 py-16">
        <div className="bg-white p-8 shadow-xl">
          <ShowingForm propertyId={property.id} />
        </div>
      </section>

      {similarHomes && similarHomes.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-col gap-6 border-t border-[#1A1A1A]/10 pt-14 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
                SIMILAR HOMES
              </p>

              <h2 className="mt-3 font-serif text-5xl font-bold">
                More homes in {property.city}
              </h2>
            </div>

            <Link
              href={`/properties?city=${encodeURIComponent(property.city)}`}
              className="font-serif text-sm uppercase tracking-[0.25em] text-[#B19A55]"
            >
              View All →
            </Link>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
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