"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type FavoriteButtonProps = {
  propertyId: string;
};

export function FavoriteButton({ propertyId }: FavoriteButtonProps) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, [propertyId]);

  async function checkFavorite() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaved(false);
      return;
    }

    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("property_id", propertyId)
      .maybeSingle();

    setSaved(!!data);
  }

  async function toggleFavorite() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first.");
      setLoading(false);
      return;
    }

    if (saved) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", user.id)
        .eq("property_id", propertyId);

      if (error) {
        alert(error.message);
      } else {
        setSaved(false);
      }
    } else {
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        property_id: propertyId,
      });

      if (error) {
        alert(error.message);
      } else {
        setSaved(true);
      }
    }

    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      disabled={loading}
      className="border border-[#1A1A1A] px-8 py-4 font-serif text-sm font-bold uppercase tracking-[0.2em]"
    >
      {loading ? "Saving..." : saved ? "Saved" : "Save Home"}
    </button>
  );
}