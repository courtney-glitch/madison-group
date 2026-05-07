"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type ImageUploaderProps = {
  onUpload: (url: string) => void;
};

export function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [message, setMessage] = useState("");

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setMessage("Uploading image...");

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("property-images")
      .upload(fileName, file);

    if (error) {
      setMessage(error.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("property-images").getPublicUrl(fileName);

    onUpload(publicUrl);
    setMessage("Image uploaded successfully.");
  }

  return (
    <div className="grid gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="border border-[#1A1A1A]/20 px-4 py-3"
      />

      {message && <p className="text-sm text-[#B19A55]">{message}</p>}
    </div>
  );
}