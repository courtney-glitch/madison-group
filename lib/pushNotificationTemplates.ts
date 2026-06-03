export type PushNotificationType =
  | "new_message"
  | "new_property_match"
  | "showing_request"
  | "hot_buyer"
  | "saved_search_alert"
  | "advisor_follow_up";

type PushNotificationTemplateInput = {
  type: PushNotificationType;
  buyerName?: string;
  propertyTitle?: string;
};

export function getPushNotificationTemplate({
  type,
  buyerName,
  propertyTitle,
}: PushNotificationTemplateInput) {
  if (type === "new_message") {
    return {
      title: "New Message",
      body: "You have a new message from Madison Group.",
    };
  }

  if (type === "new_property_match") {
    return {
      title: "New Property Match",
      body: propertyTitle
        ? `${propertyTitle} may be a strong match for your search.`
        : "A new property may be a strong match for your search.",
    };
  }

  if (type === "showing_request") {
    return {
      title: "Showing Request Received",
      body: "Your showing request has been received by Madison Group.",
    };
  }

  if (type === "hot_buyer") {
    return {
      title: "Hot Buyer Alert",
      body: buyerName
        ? `${buyerName} is showing strong buying activity.`
        : "A buyer is showing strong buying activity.",
    };
  }

  if (type === "saved_search_alert") {
    return {
      title: "Saved Search Alert",
      body: "New homes may match your saved search.",
    };
  }

  return {
    title: "Advisor Follow-Up",
    body: "Your advisor has a new recommendation for you.",
  };
}