"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ImageUploader } from "@/components/ImageUploader";

export default function NewPropertyPage() {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!image) {
      setMessage("Please upload an image first.");
      return;
    }

    const { error } = await supabase.from("properties").insert({
      title,
      city,
      price,
      beds: Number(beds),
      baths: Number(baths),
      image,
      description,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Property added successfully.");
      setTitle("");
      setCity("");
      setPrice("");
      setBeds("");
      setBaths("");
      setImage("");
      setDescription("");
    }
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
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="border border-[#1A1A1A]/20 px-4 py-3"
          />

          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border border-[#1A1A1A]/20 px-4 py-3"
          />

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

          <div className="grid gap-3">
            <p className="font-serif text-sm font-bold">Property Image</p>

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

          <button
            type="submit"
            disabled={!image}
            className="bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {image ? "Add Property" : "Upload Image First"}
          </button>

          {message && <p className="text-sm text-[#B19A55]">{message}</p>}
        </form>
      </section>
    </main>
  );
}