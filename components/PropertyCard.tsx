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
      className="group overflow-hidden rounded-[1.4rem] bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative overflow-hidden">
        {showImage ? (
          <img
            src={image}
            alt={title}
            onError={() => setImageError(true)}
            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56 xl:h-60"
          />
        ) : (
          <div className="flex h-52 items-center justify-center bg-[#1A1A1A] px-6 text-center font-serif text-sm text-white sm:h-56 xl:h-60">
            Image Coming Soon
          </div>
        )}

        {status && (
          <div
            className={`absolute left-4 top-4 rounded-full px-3 py-1.5 font-serif text-[9px] font-bold uppercase tracking-[0.18em] ${
              badgeStyles[status as keyof typeof badgeStyles] ||
              "bg-white text-[#1A1A1A]"
            }`}
          >
            {status}
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="font-serif text-[10px] uppercase tracking-[0.24em] text-[#B19A55]">
          {city}, NJ
        </p>

        <h2 className="mt-3 font-serif text-lg font-bold leading-snug text-[#1A1A1A] sm:text-xl">
          {title}
        </h2>

        <p className="mt-4 font-serif text-xl font-bold text-[#B19A55] sm:text-2xl">
          {price}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-[11px] uppercase tracking-[0.16em] text-[#1A1A1A]/55">
          <span>{beds} Beds</span>
          <span>{baths} Baths</span>
        </div>
      </div>
    </Link>
  );
}