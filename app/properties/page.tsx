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
    status?: string;
    propertyType?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  let query = supabase.from("properties").select("*");

  if (params.city) {
    query = query.ilike("city", `%${params.city}%`);
  }

  if (params.search) {
    query = query.or(
      `city.ilike.%${params.search}%,title.ilike.%${params.search}%,address.ilike.%${params.search}%`
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

  if (params.status) {
    query = query.eq("status", params.status);
  }

  if (params.propertyType) {
    query = query.ilike("property_type", `%${params.propertyType}%`);
  }

  if (params.sort === "price-low") {
    query = query.order("price_number", { ascending: true });
  } else if (params.sort === "price-high") {
    query = query.order("price_number", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: properties, error } = await query;

  if (error) {
    return (
      <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
        <section className="mx-auto max-w-7xl">
          <p className="font-serif text-2xl font-bold">
            Something went wrong loading homes.
          </p>

          <p className="mt-4 text-red-500">{error.message}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] text-[#1A1A1A]">
      <section className="bg-[#1A1A1A] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 font-serif text-sm tracking-[0.35em] text-[#D4B06A]">
            MADISON GROUP HOME SEARCH
          </p>

          <h1 className="max-w-4xl font-serif text-5xl font-bold leading-tight md:text-7xl">
            Search Bergen County homes with clarity and confidence.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">
            Browse curated luxury listings, filter by lifestyle needs, and save
            the searches that matter most.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="-mt-24 rounded-none border border-[#1A1A1A]/10 bg-white p-6 shadow-2xl">
          <PropertySearch />
          <PropertyFilters />
          <SaveSearchButton />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-b border-[#1A1A1A]/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
              AVAILABLE HOMES
            </p>

            <h2 className="mt-3 font-serif text-4xl font-bold">
              {params.city
                ? `Homes in ${params.city}`
                : params.search
                ? "Search Results"
                : "Explore Homes"}
            </h2>
          </div>

          <p className="text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">
            Showing {properties?.length || 0} homes
          </p>
        </div>

        {properties?.length === 0 ? (
          <div className="mt-10 border border-[#1A1A1A]/10 bg-white p-12 text-center shadow-xl">
            <p className="font-serif text-3xl font-bold">No homes found</p>

            <p className="mt-4 text-[#1A1A1A]/60">
              Try adjusting your filters or clearing your search.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-3">
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