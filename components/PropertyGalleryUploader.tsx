"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ImageUploader } from "@/components/ImageUploader";

type PropertyGalleryUploaderProps = {
  propertyId: string;
};

export function PropertyGalleryUploader({
  propertyId,
}: PropertyGalleryUploaderProps) {
  const [images, setImages] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    const { data } = await supabase
      .from("property_images")
      .select("*")
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false });

    if (data) {
      setImages(data);
    }
  }

  async function handleUpload(url: string) {
    const { error } = await supabase.from("property_images").insert({
      property_id: propertyId,
      image_url: url,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Gallery image added.");
    loadImages();
  }

  async function deleteImage(id: string) {
    const confirmed = confirm("Delete this gallery image?");

    if (!confirmed) return;

    await supabase.from("property_images").delete().eq("id", id);

    loadImages();
  }

  return (
    <section className="mt-10 border border-[#1A1A1A]/10 p-6">
      <h2 className="font-serif text-2xl font-bold">Gallery Images</h2>

      <div className="mt-5">
        <ImageUploader onUpload={handleUpload} />
      </div>

      {message && <p className="mt-3 text-sm text-[#B19A55]">{message}</p>}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {images.map((image) => (
          <div key={image.id} className="border border-[#1A1A1A]/10 p-3">
            <img
              src={image.image_url}
              alt="Gallery"
              className="h-40 w-full object-cover"
            />

            <button
              type="button"
              onClick={() => deleteImage(image.id)}
              className="mt-3 w-full border border-red-500 px-4 py-2 text-sm font-bold text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}