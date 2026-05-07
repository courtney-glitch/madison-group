type PropertyMapProps = {
  latitude: number | null;
  longitude: number | null;
  city: string;
};

export function PropertyMap({
  latitude,
  longitude,
  city,
}: PropertyMapProps) {
  const query =
    latitude && longitude
      ? `${latitude},${longitude}`
      : `${city}, New Jersey`;

  return (
    <section className="mt-16 border border-[#1A1A1A]/10 bg-white p-8 shadow-xl">
      <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
        LOCATION
      </p>

      <h2 className="mt-3 font-serif text-4xl font-bold">
        Explore the Area
      </h2>

      <iframe
        title="Property Map"
        src={`https://www.google.com/maps?q=${encodeURIComponent(
          query
        )}&output=embed`}
        className="mt-8 h-[420px] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </section>
  );
}