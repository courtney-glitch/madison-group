import Link from "next/link";

type PropertyCardProps = {
  id: string;
  title: string;
  city: string;
  price: string;
  beds: number;
  baths: number;
  image: string;
  status?: string;
};

export function PropertyCard({
  id,
  title,
  city,
  price,
  beds,
  baths,
  image,
  status,
}: PropertyCardProps) {
  const badgeStyles = {
    "For Sale": "bg-[#B19A55] text-white",
    Pending: "bg-orange-500 text-white",
    Sold: "bg-[#1A1A1A] text-white",
    Featured: "bg-emerald-600 text-white",
  };

  return (
    <Link
      href={`/properties/${id}`}
      className="group overflow-hidden bg-white shadow-xl transition duration-300 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-80 items-center justify-center bg-[#1A1A1A] text-white">
            No Image
          </div>
        )}

        {status && (
          <div
            className={`absolute left-4 top-4 px-4 py-2 font-serif text-xs font-bold uppercase tracking-[0.2em] ${
              badgeStyles[status as keyof typeof badgeStyles] ||
              "bg-white text-[#1A1A1A]"
            }`}
          >
            {status}
          </div>
        )}
      </div>

      <div className="p-6">
        <p className="font-serif text-sm tracking-[0.3em] text-[#B19A55]">
          {city}, NJ
        </p>

        <h2 className="mt-3 font-serif text-3xl font-bold leading-tight">
          {title}
        </h2>

        <p className="mt-5 font-serif text-3xl font-bold text-[#B19A55]">
          {price}
        </p>

        <div className="mt-6 flex gap-6 text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">
          <span>{beds} Beds</span>
          <span>{baths} Baths</span>
        </div>
      </div>
    </Link>
  );
}