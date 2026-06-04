"use client";

import Link from "next/link";
import { useState } from "react";

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
  const [imageError, setImageError] = useState(false);

  const badgeStyles = {
    "For Sale": "bg-[#B19A55] text-white",
    Pending: "bg-orange-500 text-white",
    Sold: "bg-[#1A1A1A] text-white",
    Featured: "bg-emerald-600 text-white",
  };

  const showImage = image && !imageError;

  return (
    <Link
      href={`/properties/${id}`}
      className="group block w-full overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative overflow-hidden">
        {showImage ? (
          <img
            src={image}
            alt={title}
            onError={() => setImageError(true)}
            className="h-36 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-48 xl:h-56"
          />
        ) : (
          <div className="flex h-36 items-center justify-center bg-[#1A1A1A] px-4 text-center font-serif text-xs text-white sm:h-48 xl:h-56">
            Image Coming Soon
          </div>
        )}

        {status && (
          <div
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 font-serif text-[8px] font-bold uppercase tracking-[0.14em] sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[9px] ${
              badgeStyles[status as keyof typeof badgeStyles] ||
              "bg-white text-[#1A1A1A]"
            }`}
          >
            {status}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <p className="truncate font-serif text-[9px] uppercase tracking-[0.2em] text-[#B19A55] sm:text-[10px]">
          {city}, NJ
        </p>

        <h2 className="mt-2 line-clamp-2 font-serif text-base font-bold leading-snug text-[#1A1A1A] sm:mt-3 sm:text-lg">
          {title}
        </h2>

        <p className="mt-3 font-serif text-lg font-bold text-[#B19A55] sm:text-xl">
          {price}
        </p>

        <div className="mt-3 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.13em] text-[#1A1A1A]/55 sm:text-[11px]">
          <span>{beds} Beds</span>
          <span>{baths} Baths</span>
        </div>
      </div>
    </Link>
  );
}