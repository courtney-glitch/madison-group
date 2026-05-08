import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShowingForm } from "@/components/ShowingForm";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import { PropertyMap } from "@/components/PropertyMap";

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

  return (
    <main className="min-h-screen bg-[#F8F5EF] text-[#1A1A1A]">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <Link href="/properties" className="font-serif text-sm text-[#B19A55]">
          ← Back to homes
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            {allImages.length > 0 ? (
              <div className="grid gap-4">
                <img
                  src={allImages[0].image_url}
                  alt={property.title}
                  className="h-[560px] w-full object-cover shadow-2xl"
                />

                {allImages.length > 1 && (
                  <div className="grid gap-4 md:grid-cols-3">
                    {allImages.slice(1, 4).map((image) => (
                      <img
                        key={image.id}
                        src={image.image_url}
                        alt={property.title}
                        className="h-40 w-full object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-[620px] w-full items-center justify-center bg-[#1A1A1A] text-white">
                No Image Available
              </div>
            )}
          </div>

          <aside className="bg-white p-8 shadow-xl">
            <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
              {property.city}, NJ
            </p>

            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight">
              {property.title}
            </h1>

            <p className="mt-6 font-serif text-4xl font-bold text-[#B19A55]">
              {property.price}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 border-y border-[#1A1A1A]/10 py-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                  Beds
                </p>
                <p className="mt-2 font-serif text-2xl font-bold">
                  {property.beds}
                </p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                  Baths
                </p>
                <p className="mt-2 font-serif text-2xl font-bold">
                  {property.baths}
                </p>
              </div>
            </div>

            {(property.address || property.zip_code) && (
              <div className="mt-8 border-b border-[#1A1A1A]/10 pb-6">
                <p className="text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                  Address
                </p>

                <p className="mt-2 leading-7">
                  {property.address && (
                    <>
                      {property.address}
                      <br />
                    </>
                  )}
                  {property.city}, NJ {property.zip_code}
                </p>
              </div>
            )}

            <p className="mt-8 leading-8 text-[#1A1A1A]/75">
              {property.description}
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

      {allImages.length > 4 && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <p className="mb-6 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
            PROPERTY GALLERY
          </p>

          <div className="grid gap-4 md:grid-cols-4">
            {allImages.slice(4).map((image) => (
              <img
                key={image.id}
                src={image.image_url}
                alt={property.title}
                className="h-48 w-full object-cover"
              />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-12">
        <MortgageCalculator price={property.price} />

        <PropertyMap
          latitude={property.latitude}
          longitude={property.longitude}
          city={property.city}
          address={property.address}
          zipCode={property.zip_code}
        />
      </section>

      <section id="showing" className="mx-auto max-w-4xl px-6 py-16">
        <div className="bg-white p-8 shadow-xl">
          <ShowingForm propertyId={property.id} />
        </div>
      </section>
    </main>
  );
}