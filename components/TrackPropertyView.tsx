"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

type TrackPropertyViewProps = {
  propertyId: string;
};

export function TrackPropertyView({ propertyId }: TrackPropertyViewProps) {
  useEffect(() => {
    async function trackView() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase.from("property_views").insert({
        user_id: user.id,
        property_id: propertyId,
      });
    }

    trackView();
  }, [propertyId]);

  return null;
}