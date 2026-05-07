import Link from "next/link";

type PropertyCardProps = {
  id: string;
  title: string;
  city: string;
  price: string;
  beds: number;
  baths: number;
  image: string;
};

export function PropertyCard({
  id,
  title,
  city,
  price,
  beds,
  baths,
  image,
}: PropertyCardProps) {
  return (
    <article className="border border-[#1A1A1A]/20 bg-white p-6">
      {image ? (
        <img
          src={image}
          alt={title}
          className="mb-5 h-48 w-full object-cover"
        />
      ) : (
        <div className="mb-5 flex h-48 w-full items-center justify-center bg-[#1A1A1A] text-white">
          No Image
        </div>
      )}

      <p className="font-serif text-sm tracking-[0.25em] text-[#B19A55]">
        {city}, NJ
      </p>

      <h2 className="mt-3 font-serif text-2xl font-bold">{title}</h2>

      <p className="mt-4 text-xl font-bold">{price}</p>

      <p className="mt-2 text-sm">
        {beds} beds · {baths} baths
      </p>

      <Link
        href={`/properties/${id}`}
        className="mt-6 block bg-[#B19A55] px-4 py-3 text-center font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
      >
        View Details
      </Link>
    </article>
  );
}