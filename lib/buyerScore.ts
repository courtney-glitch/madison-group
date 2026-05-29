export type BuyerScoreResult = {
  score: number;
  label: "Cold" | "Warm" | "Hot";
  message: string;
};

type BuyerScoreInput = {
  propertyViews: number;
  favorites: number;
  savedSearches: number;
  showingRequests: number;
  messages: number;
  notes: number;
};

export function calculateBuyerScore({
  propertyViews,
  favorites,
  savedSearches,
  showingRequests,
  messages,
  notes,
}: BuyerScoreInput): BuyerScoreResult {
  const score =
    propertyViews * 2 +
    favorites * 8 +
    savedSearches * 10 +
    showingRequests * 20 +
    messages * 6 +
    notes * 5;

  if (score >= 60) {
    return {
      score,
      label: "Hot",
      message:
        "This buyer is highly engaged and should receive immediate advisor follow-up.",
    };
  }

  if (score >= 25) {
    return {
      score,
      label: "Warm",
      message:
        "This buyer is showing meaningful interest and should be nurtured soon.",
    };
  }

  return {
    score,
    label: "Cold",
    message:
      "This buyer has light activity and may need more education or re-engagement.",
  };
}