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
      <div className="flex h-[620px] w-full items-center justify-center bg-[#1A1A1A] text-white">
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

    setActiveIndex(
      activeIndex === 0 ? safeImages.length - 1 : activeIndex - 1
    );
  }

  return (
    <>
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <button
          type="button"
          onClick={() => openImage(0)}
          className="group relative overflow-hidden text-left"
        >
          <img
            src={mainImage.image_url}
            alt={title}
            className="h-[720px] w-full object-cover transition duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />

          <div className="absolute bottom-6 left-6 bg-white/90 px-5 py-3 backdrop-blur">
            <p className="font-serif text-sm uppercase tracking-[0.25em] text-[#B19A55]">
              View Gallery
            </p>
          </div>
        </button>

        <div className="grid gap-4">
          {sideImages.length > 0 ? (
            sideImages.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => openImage(index + 1)}
                className="group relative overflow-hidden text-left"
              >
                <img
                  src={image.image_url}
                  alt={`${title} ${index + 2}`}
                  className="h-[170px] w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />

                {index === sideImages.length - 1 && safeImages.length > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-white">
                    <p className="font-serif text-2xl font-bold">
                      +{safeImages.length - 5} More
                    </p>
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="grid gap-4">
              <div className="h-[170px] bg-[#EFE7D6]" />
              <div className="h-[170px] bg-[#EFE7D6]" />
              <div className="h-[170px] bg-[#EFE7D6]" />
              <div className="h-[170px] bg-[#EFE7D6]" />
            </div>
          )}
        </div>
      </section>

      {activeIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 px-6 py-8 text-white">
          <button
            type="button"
            onClick={closeImage}
            className="absolute right-6 top-6 z-20 border border-white/20 px-5 py-3 font-serif text-xs uppercase tracking-[0.25em]"
          >
            Close
          </button>

          <button
            type="button"
            onClick={previousImage}
            className="absolute left-6 top-1/2 z-20 -translate-y-1/2 border border-white/20 px-5 py-4 font-serif text-xl"
          >
            ←
          </button>

          <button
            type="button"
            onClick={nextImage}
            className="absolute right-6 top-1/2 z-20 -translate-y-1/2 border border-white/20 px-5 py-4 font-serif text-xl"
          >
            →
          </button>

          <div className="flex h-full items-center justify-center">
            <img
              src={safeImages[activeIndex].image_url}
              alt={title}
              className="max-h-[85vh] max-w-[92vw] object-contain"
            />
          </div>

          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-serif text-sm uppercase tracking-[0.25em] text-white/60">
            {activeIndex + 1} / {safeImages.length}
          </p>
        </div>
      )}
    </>
  );
}