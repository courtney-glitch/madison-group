"use client";

import { useEffect, useState } from "react";
import { MessageSquareText, Save, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

type PropertyNotesProps = {
  propertyId: string;
};

export function PropertyNotes({ propertyId }: PropertyNotesProps) {
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadNote() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("property_notes")
        .select("*")
        .eq("user_id", user.id)
        .eq("property_id", propertyId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setRating(data.rating || 0);
        setNote(data.note || "");
      }
    }

    loadNote();
  }, [propertyId]);

  async function saveNote() {
    setLoading(true);
    setStatus("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("Please login first to save notes.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("property_notes").insert({
      user_id: user.id,
      property_id: propertyId,
      rating,
      note,
    });

    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Notes saved successfully.");
    }

    setLoading(false);
  }

  return (
    <section className="rounded-[1.5rem] bg-white p-6 shadow-xl">
      <div className="flex items-center gap-3">
        <MessageSquareText className="text-[#B19A55]" />

        <div>
          <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
            Buyer Notes
          </p>

          <h2 className="mt-2 font-serif text-2xl font-bold">
            My Notes & Rating
          </h2>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 font-serif text-sm font-bold">Rating</p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`rounded-full p-2 transition ${
                star <= rating
                  ? "bg-[#B19A55] text-white"
                  : "bg-[#F8F5EF] text-[#1A1A1A]/35"
              }`}
            >
              <Star size={18} fill={star <= rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="font-serif text-sm font-bold">Private Notes</label>

        <textarea
          rows={5}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write what you liked, disliked, questions for your agent, or reminders from the tour..."
          className="mt-3 w-full rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none transition focus:border-[#B19A55]"
        />
      </div>

      <button
        type="button"
        onClick={saveNote}
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749] disabled:opacity-50"
      >
        <Save size={15} />

        {loading ? "Saving..." : "Save Notes"}
      </button>

      {status && (
        <p className="mt-4 rounded-2xl bg-[#F8F5EF] px-4 py-3 text-sm text-[#1A1A1A]/65">
          {status}
        </p>
      )}
    </section>
  );
}