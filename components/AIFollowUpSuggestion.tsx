"use client";

import { useMemo } from "react";
import { Copy, Sparkles } from "lucide-react";

type AIFollowUpSuggestionProps = {
  buyerLabel: "Cold" | "Warm" | "Hot";
  buyerScore: number;
  propertyViews: number;
  favorites: number;
  savedSearches: number;
  showingRequests: number;
  messages: number;
};

export function AIFollowUpSuggestion({
  buyerLabel,
  buyerScore,
  propertyViews,
  favorites,
  savedSearches,
  showingRequests,
  messages,
}: AIFollowUpSuggestionProps) {
  const suggestion = useMemo(() => {
    if (buyerLabel === "Hot") {
      return `Hi, I noticed you’ve been actively reviewing homes and showing strong interest. Would you like me to help narrow down the best options and schedule a private showing this week?`;
    }

    if (buyerLabel === "Warm") {
      return `Hi, I saw you’ve been exploring a few properties. I’d be happy to send you similar homes that better match what you’re looking for. Are there any features that matter most to you right now?`;
    }

    return `Hi, I wanted to check in and see how your home search is going. If you’re still exploring, I can help you understand the market and send a few good options based on your goals.`;
  }, [buyerLabel]);

  async function copySuggestion() {
    await navigator.clipboard.writeText(suggestion);
  }

  return (
    <div className="mt-5 rounded-3xl bg-white p-5 text-[#1A1A1A]">
      <div className="flex items-center gap-2 text-[#B19A55]">
        <Sparkles size={16} />

        <p className="font-serif text-sm font-bold">
          AI Follow-Up Suggestion
        </p>
      </div>

      <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/70">
        {suggestion}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#1A1A1A]/50">
        <span>Score: {buyerScore}</span>
        <span>Views: {propertyViews}</span>
        <span>Favorites: {favorites}</span>
        <span>Searches: {savedSearches}</span>
        <span>Showings: {showingRequests}</span>
        <span>Messages: {messages}</span>
      </div>

      <button
        type="button"
        onClick={copySuggestion}
        className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749]"
      >
        <Copy size={14} />
        Copy Message
      </button>
    </div>
  );
}