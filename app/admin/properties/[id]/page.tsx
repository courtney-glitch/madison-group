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
            ← Back to homes
          </Link>

          <h1 className="mt-8 font-serif text-4xl font-bold">
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
    { label: "Square Feet", value: property.sqft ? property.sqft.toLocaleString() : null },
    { label: "Property Type", value: property.property_type },
    { label: "Year Built", value: property.year_built },
    { label: "Garage", value: property.garage },
    { label: "Lot Size", value: property.lot_size },
    { label: "Taxes", value: property.taxes },
    { label: "School District", value: property.school_district },
  ].filter((item) => item.value);

  return (
    <main className="min-h-screen bg-[#F8F5EF] text-[#1A1A1A]">
      <TrackPropertyView propertyId={property.id} />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link href="/properties" className="font-serif text-sm text-[#B19A55]">
          ← Back to homes
        </Link>

        <div className="mt-8">
          <PropertyGallery images={allImages} title={property.title} />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.42fr]">
          <section>
            <div className="flex flex-col gap-6 border-b border-[#1A1A1A]/10 pb-10 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
                  {property.city}, NJ
                </p>

                <h1 className="mt-4 font-serif text-5xl font-bold leading-tight md:text-6xl">
                  {property.title}
                </h1>

                {(property.address || property.zip_code) && (
                  <p className="mt-5 text-lg text-[#1A1A1A]/70">
                    {property.address && `${property.address}, `}
                    {property.city}, NJ {property.zip_code}
                  </p>
                )}
              </div>

              <div className="md:text-right">
                {property.status && (
                  <p className="mb-3 inline-block bg-[#B19A55] px-4 py-2 font-serif text-xs font-bold uppercase tracking-[0.2em] text-white">
                    {property.status}
                  </p>
                )}

                <p className="font-serif text-4xl font-bold text-[#B19A55]">
                  {property.price}
                </p>
              </div>
            </div>

            <div className="grid border-b border-[#1A1A1A]/10 py-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="border-[#1A1A1A]/10 py-4 sm:border-r">
                <p className="text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                  Beds
                </p>
                <p className="mt-2 font-serif text-3xl font-bold">
                  {property.beds}
                </p>
              </div>

              <div className="border-[#1A1A1A]/10 py-4 sm:border-r sm:pl-8">
                <p className="text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                  Baths
                </p>
                <p className="mt-2 font-serif text-3xl font-bold">
                  {property.baths}
                </p>
              </div>

              <div className="border-[#1A1A1A]/10 py-4 lg:border-r lg:pl-8">
                <p className="text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                  Sq Ft
                </p>
                <p className="mt-2 font-serif text-3xl font-bold">
                  {property.sqft ? property.sqft.toLocaleString() : "—"}
                </p>
              </div>

              <div className="py-4 lg:pl-8">
                <p className="text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                  Type
                </p>
                <p className="mt-2 font-serif text-3xl font-bold">
                  {property.property_type || "Home"}
                </p>
              </div>
            </div>

            <section className="py-12">
              <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
                PROPERTY OVERVIEW
              </p>

              <h2 className="font-serif text-4xl font-bold">
                Elevated living in {property.city}.
              </h2>

              <p className="mt-6 max-w-4xl text-lg leading-9 text-[#1A1A1A]/75">
                {property.description}
              </p>
            </section>

            {details.length > 0 && (
              <section className="border-t border-[#1A1A1A]/10 py-12">
                <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
                  PROPERTY DETAILS
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {details.map((detail) => (
                    <div
                      key={detail.label}
                      className="border border-[#1A1A1A]/10 bg-white p-6 shadow-sm"
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

            <section className="py-12">
              <MortgageCalculator price={property.price} />

              <PropertyMap
                latitude={property.latitude}
                longitude={property.longitude}
                city={property.city}
                address={property.address}
                zipCode={property.zip_code}
              />
            </section>
          </section>

          <aside className="h-fit bg-white p-8 shadow-2xl lg:sticky lg:top-28">
            <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
              PRIVATE TOUR
            </p>

            <h2 className="mt-3 font-serif text-3xl font-bold">
              Schedule a Showing
            </h2>

            <p className="mt-4 leading-7 text-[#1A1A1A]/70">
              Request a private tour and a Madison Group advisor will follow up
              with next steps.
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
          </aside>
        </div>
      </section>

      <section id="showing" className="mx-auto max-w-4xl px-6 py-16">
        <div className="bg-white p-8 shadow-xl">
          <ShowingForm propertyId={property.id} />
        </div>
      </section>
    </main>
  );
}