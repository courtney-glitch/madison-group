import { PropertyCard } from "@/components/PropertyCard";
import { PropertySearch } from "@/components/PropertySearch";
import { PropertyFilters } from "@/components/PropertyFilters";
import { SaveSearchButton } from "@/components/SaveSearchButton";
import { supabase } from "@/lib/supabase";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    city?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    beds?: string;
    baths?: string;
  }>;
}) {
  const params = await searchParams;

  let query = supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (params.city) {
    query = query.ilike("city", `%${params.city}%`);
  }

  if (params.search) {
    query = query.or(
      `city.ilike.%${params.search}%,title.ilike.%${params.search}%`
    );
  }

  if (params.minPrice) {
    query = query.gte("price_number", Number(params.minPrice));
  }

  if (params.maxPrice) {
    query = query.lte("price_number", Number(params.maxPrice));
  }

  if (params.beds) {
    query = query.gte("beds", Number(params.beds));
  }

  if (params.baths) {
    query = query.gte("baths", Number(params.baths));
  }

  const { data: properties, error } = await query;

  if (error) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
        <p className="font-serif text-2xl font-bold">
          Something went wrong loading homes.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-7xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          MADISON GROUP
        </p>

        <h1 className="font-serif text-5xl font-bold md:text-6xl">
          {params.city
            ? `Homes in ${params.city}`
            : params.search
            ? "Search Results"
            : "Explore Homes"}
        </h1>

        <p className="mt-4 max-w-2xl text-lg leading-8 text-[#1A1A1A]/70">
          Search thoughtfully selected properties with clarity, calm, and
          advocacy from the Madison Group team.
        </p>

        <PropertySearch />

        <PropertyFilters />

        <SaveSearchButton />

        <p className="mt-8 text-sm text-[#1A1A1A]/70">
          Showing {properties?.length || 0} homes
        </p>

        {properties?.length === 0 ? (
          <div className="mt-10 border border-[#1A1A1A]/10 bg-white p-10 text-center">
            <p className="font-serif text-2xl font-bold">No homes found</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {properties?.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                city={property.city}
                price={property.price}
                beds={property.beds}
                baths={property.baths}
                image={property.image}
                status={property.status}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}