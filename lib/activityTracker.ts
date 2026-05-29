import { supabase } from "@/lib/supabase";

type TrackActivityInput = {
  userId: string;
  propertyId?: string;
  activityType:
    | "property_view"
    | "favorite"
    | "saved_search"
    | "showing_request"
    | "message"
    | "note"
    | "compare";
  activityLabel?: string;
};

export async function trackBuyerActivity({
  userId,
  propertyId,
  activityType,
  activityLabel,
}: TrackActivityInput) {
  if (!userId) return;

  await supabase.from("buyer_activities").insert({
    user_id: userId,
    property_id: propertyId || null,
    activity_type: activityType,
    activity_label: activityLabel || null,
  });
}