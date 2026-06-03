import { supabase } from "@/lib/supabase";

type CreateNotificationEventInput = {
  userId: string;
  notificationType: string;
  title: string;
  body: string;

  relatedPropertyId?: string;
  relatedConversationId?: string;
};

export async function createNotificationEvent({
  userId,
  notificationType,
  title,
  body,
  relatedPropertyId,
  relatedConversationId,
}: CreateNotificationEventInput) {
  const { error } = await supabase
    .from("notification_events")
    .insert({
      user_id: userId,
      notification_type: notificationType,
      title,
      body,
      related_property_id: relatedPropertyId || null,
      related_conversation_id: relatedConversationId || null,
    });

  if (error) {
    console.error("Notification event error:", error.message);
  }
}