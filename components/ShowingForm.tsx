"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type ShowingFormProps = {
  propertyId: string;
};

export function ShowingForm({ propertyId }: ShowingFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    const { error } = await supabase.from("showings").insert({
      property_id: propertyId,
      full_name: fullName,
      email,
      phone,
      message,
    });

    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Showing request sent successfully.");
      setFullName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-12 grid gap-5">
      <h2 className="font-serif text-3xl font-bold">Request a Showing</h2>

      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        className="border border-[#1A1A1A]/20 px-4 py-3"
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border border-[#1A1A1A]/20 px-4 py-3"
      />

      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border border-[#1A1A1A]/20 px-4 py-3"
      />

      <textarea
        rows={5}
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border border-[#1A1A1A]/20 px-4 py-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-[#B19A55] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Request"}
      </button>

      {status && <p className="text-sm text-[#B19A55]">{status}</p>}
    </form>
  );
}