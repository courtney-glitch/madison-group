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

  if (images.length === 0) {
    return (
      <div className="flex h-[620px] w-full items-center justify-center bg-[#1A1A1A] text-white">
        No Image Available
      </div>
    );
  }

  const activeImage = activeIndex !== null ? images[activeIndex] : null;

  function nextImage() {
    if (activeIndex === null) return;

    setActiveIndex((activeIndex + 1) % images.length);
  }

  function previousImage() {
    if (activeIndex === null) return;

    setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  }

  return (
    <>
      <div className="grid gap-4">
        <button
          type="button"
          onClick={() => setActiveIndex(0)}
          className="block text-left"
        >
          <img
            src={images[0].image_url}
            alt={title}
            className="h-[560px] w-full object-cover shadow-2xl transition hover:opacity-90"
          />
        </button>

        {images.length > 1 && (
          <div className="grid gap-4 md:grid-cols-3">
            {images.slice(1, 4).map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index + 1)}
                className="block text-left"
              >
                <img
                  src={image.image_url}
                  alt={title}
                  className="h-40 w-full object-cover transition hover:opacity-80"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {activeImage && activeIndex !== null && (
        <div className="fixed inset-0 z-[999] bg-black/95 px-6 py-6 text-white">
          <div className="mx-auto flex h-full max-w-7xl flex-col">
            <div className="flex items-center justify-between">
              <p className="font-serif text-sm tracking-[0.35em] text-[#D4B06A]">
                PROPERTY GALLERY
              </p>

              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="border border-white/30 px-5 py-2 font-serif text-sm uppercase tracking-[0.2em]"
              >
                Close
              </button>
            </div>

            <div className="relative mt-6 flex flex-1 items-center justify-center">
              <button
                type="button"
                onClick={previousImage}
                className="absolute left-0 z-10 bg-white/10 px-5 py-4 font-serif text-2xl backdrop-blur hover:bg-white/20"
              >
                ←
              </button>

              <img
                src={activeImage.image_url}
                alt={title}
                className="max-h-[75vh] w-full object-contain"
              />

              <button
                type="button"
                onClick={nextImage}
                className="absolute right-0 z-10 bg-white/10 px-5 py-4 font-serif text-2xl backdrop-blur hover:bg-white/20"
              >
                →
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-white/60">
              {activeIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}