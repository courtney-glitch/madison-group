import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ShowingForm } from "@/components/ShowingForm";
import { MortgageCalculator } from "@/components/MortgageCalculator";

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

  if (error || !property) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
        <section className="mx-auto max-w-6xl">
          <Link
            href="/properties"
            className="font-serif text-sm text-[#B19A55]"
          >
            ← Back to homes
          </Link>

          <h1 className="mt-8 font-serif text-4xl font-bold">
            Home not found
          </h1>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#1A1A1A]">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/properties"
          className="font-serif text-sm text-[#B19A55]"
        >
          ← Back to homes
        </Link>

        {property.image ? (
          <img
            src={property.image}
            alt={property.title}
            className="mt-8 h-[420px] w-full object-cover"
          />
        ) : (
          <div className="mt-8 flex h-[420px] w-full items-center justify-center bg-[#1A1A1A] text-white">
            No Image Available
          </div>
        )}

        <p className="mt-8 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          {property.city}, NJ
        </p>

        <h1 className="mt-3 max-w-4xl font-serif text-4xl font-bold md:text-6xl">
          {property.title}
        </h1>

        <p className="mt-5 text-3xl font-bold">
          {property.price}
        </p>

        <p className="mt-3 text-lg">
          {property.beds} beds · {property.baths} baths
        </p>

        <p className="mt-8 max-w-3xl text-lg leading-8">
          {property.description}
        </p>

        <div className="mt-10">
          <FavoriteButton propertyId={property.id} />
        </div>

        <MortgageCalculator price={property.price} />

        <ShowingForm propertyId={property.id} />
      </section>
    </main>
  );
}