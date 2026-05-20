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
          <p className="font-serif text-xl font-bold">
            Something went wrong loading homes.
          </p>

          <p className="mt-4 text-sm text-red-500">{error.message}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] text-[#1A1A1A]">
      <section className="bg-[#1A1A1A] px-6 py-14 text-white md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 font-serif text-[11px] uppercase tracking-[0.32em] text-[#D4B06A]">
            Madison Group Home Search
          </p>

          <h1 className="max-w-4xl font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-bold leading-tight">
            Search Bergen County homes with clarity and confidence.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-white/65 md:text-lg">
            Browse curated luxury listings, filter by lifestyle needs, and save
            the searches that matter most.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="-mt-20 rounded-[1.5rem] border border-[#1A1A1A]/10 bg-white p-5 shadow-xl md:p-6">
          <PropertySearch />
          <PropertyFilters />
          <SaveSearchButton />
        </div>

        <div className="mt-9 flex flex-col gap-4 border-b border-[#1A1A1A]/10 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Available Homes
            </p>

            <h2 className="mt-2 font-serif text-[clamp(2rem,4vw,3rem)] font-bold leading-tight">
              {params.city
                ? `Homes in ${params.city}`
                : params.search
                ? "Search Results"
                : "Explore Homes"}
            </h2>
          </div>

          <p className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/55">
            Showing {properties?.length || 0} homes
          </p>
        </div>

        {properties?.length === 0 ? (
          <div className="mt-9 rounded-[1.5rem] border border-[#1A1A1A]/10 bg-white p-10 text-center shadow-lg">
            <p className="font-serif text-2xl font-bold">No homes found</p>

            <p className="mt-3 text-sm text-[#1A1A1A]/60">
              Try adjusting your filters or clearing your search.
            </p>
          </div>
        ) : (
          <div className="mt-9 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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