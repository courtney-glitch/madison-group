"use client";

import { useState } from "react";

type GalleryImage = {
  id: string;
  image_url: string;
};

type PropertyGalleryProps = {
  images: GalleryImage[];
  title: string;
};

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const safeImages = images?.filter((image) => image.image_url) || [];
  const mainImage = safeImages[0];
  const sideImages = safeImages.slice(1, 5);

  if (!mainImage) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl bg-[#1A1A1A] text-sm text-white md:h-[520px]">
        Image Coming Soon
      </div>
    );
  }

  function openImage(index: number) {
    setActiveIndex(index);
  }

  function closeImage() {
    setActiveIndex(null);
  }

  function nextImage() {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % safeImages.length);
  }

  function previousImage() {
    if (activeIndex === null) return;
    setActiveIndex(activeIndex === 0 ? safeImages.length - 1 : activeIndex - 1);
  }

  return (
    <>
      <section
        className={`grid gap-3 ${
          sideImages.length > 0 ? "lg:grid-cols-[1.3fr_0.7fr]" : "lg:grid-cols-1"
        }`}
      >
        <button
          type="button"
          onClick={() => openImage(0)}
          className="group relative overflow-hidden rounded-2xl text-left"
        >
          <img
            src={mainImage.image_url}
            alt={title}
            className="h-64 w-full object-cover transition duration-700 group-hover:scale-105 md:h-[620px]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />

          <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 backdrop-blur md:bottom-6 md:left-6 md:px-5 md:py-3">
            <p className="font-serif text-[10px] uppercase tracking-[0.2em] text-[#B19A55] md:text-sm">
              View Gallery
            </p>
          </div>
        </button>

        {sideImages.length > 0 && (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {sideImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => openImage(index + 1)}
                className="group relative overflow-hidden rounded-2xl text-left"
              >
                <img
                  src={image.image_url}
                  alt={`${title} ${index + 2}`}
                  className="h-28 w-full object-cover transition duration-700 group-hover:scale-105 md:h-[145px]"
                />

                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

                {index === sideImages.length - 1 && safeImages.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-white">
                    <p className="font-serif text-xl font-bold">
                      +{safeImages.length - 5} More
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {activeIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 px-4 py-8 text-white">
          <button
            type="button"
            onClick={closeImage}
            className="absolute right-4 top-4 z-20 rounded-full border border-white/20 px-4 py-2 font-serif text-[10px] uppercase tracking-[0.2em]"
          >
            Close
          </button>

          <button
            type="button"
            onClick={previousImage}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 px-4 py-3 font-serif text-lg"
          >
            ←
          </button>

          <button
            type="button"
            onClick={nextImage}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 px-4 py-3 font-serif text-lg"
          >
            →
          </button>

          <div className="flex h-full items-center justify-center">
            <img
              src={safeImages[activeIndex].image_url}
              alt={title}
              className="max-h-[82vh] max-w-[92vw] object-contain"
            />
          </div>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-serif text-[10px] uppercase tracking-[0.25em] text-white/60">
            {activeIndex + 1} / {safeImages.length}
          </p>
        </div>
      )}
    </>
  );
}