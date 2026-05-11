"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ImageUploader } from "@/components/ImageUploader";

export default function AddPropertyPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [price, setPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const numericPrice = Number(
      price.replace(/[^0-9]/g, "")
    );

    const { error } = await supabase.from("properties").insert({
      title,
      city,
      address,
      zip_code: zipCode,
      price,
      price_number: numericPrice,
      beds: Number(beds),
      baths: Number(baths),
      image,
      description,
      latitude: latitude ? Number(latitude) : null,
      longitude: longitude ? Number(longitude) : null,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/admin/properties");
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-3xl">
        <p className="mb-3 font-serif text-sm tracking-[0.35em] text-[#B19A55]">
          ADMIN
        </p>

        <h1 className="font-serif text-4xl font-bold">Add Property</h1>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-5">
          <input
            type="text"
            placeholder="Property title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border border-[#1A1A1A]/20 px-4 py-3"
          />

          <input
            type="text"
            placeholder="Street Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border border-[#1A1A1A]/20 px-4 py-3"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="border border-[#1A1A1A]/20 px-4 py-3"
            />

            <input
              type="text"
              placeholder="ZIP Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="border border-[#1A1A1A]/20 px-4 py-3"
            />
          </div>

          <input
            type="text"
            placeholder="$2,500,000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border border-[#1A1A1A]/20 px-4 py-3"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="number"
              placeholder="Beds"
              value={beds}
              onChange={(e) => setBeds(e.target.value)}
              required
              className="border border-[#1A1A1A]/20 px-4 py-3"
            />

            <input
              type="number"
              placeholder="Baths"
              value={baths}
              onChange={(e) => setBaths(e.target.value)}
              required
              className="border border-[#1A1A1A]/20 px-4 py-3"
            />
          </div>

          <div className="grid gap-3">
            <p className="font-serif text-sm font-bold">
              Main Property Image
            </p>

            <ImageUploader onUpload={setImage} />

            {image && (
              <img
                src={image}
                alt="Preview"
                className="h-48 w-full object-cover"
              />
            )}
          </div>

          <textarea
            placeholder="Description"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border border-[#1A1A1A]/20 px-4 py-3"
          />

          <div className="grid gap-5 md:grid-cols-2">
            <input
              type="text"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="border border-[#1A1A1A]/20 px-4 py-3"
            />

            <input
              type="text"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="border border-[#1A1A1A]/20 px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white"
          >
            Add Property
          </button>

          {message && (
            <p className="text-sm text-red-500">{message}</p>
          )}
        </form>
      </section>
    </main>
  );
}