"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Eye,
  Home,
  Loader2,
  MessageCircle,
  Plus,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type SellerListing = {
  id: string;
  seller_name: string | null;
  property_address: string | null;
  current_stage: string | null;
  seller_stage: string | null;
  listing_views: number | null;
  showing_requests: number | null;
  buyer_interest: string | null;
  advisor_notes: string | null;
  created_at: string;
};

const timeline = [
  "Listing Preparation",
  "Photography & Marketing",
  "Active on Market",
  "Showing Activity",
  "Offer Review",
  "Under Contract",
  "Inspection & Appraisal",
  "Closing Preparation",
];

export default function SellerDashboardPage() {
  const [listings, setListings] = useState<SellerListing[]>([]);
  const [sellerName, setSellerName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadListings();
  }, []);

  async function loadListings() {
    setLoading(true);

    const { data, error } = await supabase
      .from("seller_listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    setListings((data || []) as SellerListing[]);
    setLoading(false);
  }

  async function updateSellerStage(
  id: string,
  seller_stage: string
) {
  const { error } = await supabase
    .from("seller_listings")
    .update({ seller_stage })
    .eq("id", id);

  if (!error) {
    await loadListings();
  }
}

  async function addListing() {
    if (!sellerName.trim() || !propertyAddress.trim()) {
      setStatus("Please add seller name and property address.");
      return;
    }

    setAdding(true);
    setStatus("");

    const { error } = await supabase.from("seller_listings").insert({
      seller_name: sellerName.trim(),
      property_address: propertyAddress.trim(),
      seller_stage: "Active on Market",
      listing_views: 0,
      showing_requests: 0,
      buyer_interest: "Medium",
      advisor_notes:
        "Advisor notes can be added here for seller updates and next steps.",
    });

    if (error) {
      setStatus(error.message);
      setAdding(false);
      return;
    }

    setSellerName("");
    setPropertyAddress("");
    setAdding(false);
    await loadListings();
  }

  const activeListing = listings[0];

  const sellerStats = [
    {
      title: "Listing Views",
      value: activeListing?.listing_views?.toString() || "0",
      icon: Eye,
    },
    {
      title: "Showing Requests",
      value: activeListing?.showing_requests?.toString() || "0",
      icon: CalendarDays,
    },
    {
      title: "Buyer Interest",
      value: activeListing?.buyer_interest || "None",
      icon: TrendingUp,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Seller Portal
            </p>

            <h1 className="mt-3 font-serif text-4xl font-bold md:text-6xl">
              Seller Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#1A1A1A]/65 md:text-base">
              Track listing performance, showing activity, buyer interest, and
              seller progress in one organized experience.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                <Home size={24} />
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#B19A55]">
                  Current Stage
                </p>

                <h2 className="mt-1 font-serif text-2xl font-bold">
                  {activeListing?.seller_stage || "No Active Listing"}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {status && (
          <p className="mt-6 rounded-2xl bg-white px-4 py-3 text-sm text-red-600 shadow-xl">
            {status}
          </p>
        )}

        <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-xl">
          <h2 className="font-serif text-2xl font-bold">Add Seller Listing</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <input
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              placeholder="Seller name"
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
            />

            <input
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              placeholder="Property address"
              className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none"
            />

            <button
              type="button"
              onClick={addListing}
              disabled={adding}
              className="flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white disabled:opacity-50"
            >
              {adding ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              {adding ? "Adding..." : "Add Listing"}
            </button>
          </div>
        </section>

        {loading ? (
          <div className="mt-10 rounded-[2rem] bg-white p-6 shadow-xl">
            <p className="text-sm text-[#1A1A1A]/60">Loading seller data...</p>
          </div>
        ) : (
          <>
            <section className="mt-10 grid gap-5 md:grid-cols-3">
              {sellerStats.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[2rem] bg-white p-6 shadow-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                      <Icon size={22} />
                    </div>

                    <p className="mt-5 font-serif text-4xl font-bold">
                      {item.value}
                    </p>

                    <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#1A1A1A]/45">
                      {item.title}
                    </p>
                  </div>
                );
              })}
            </section>

            <section className="mt-10 grid gap-6 lg:grid-cols-[0.6fr_0.4fr]">
              <div className="rounded-[2rem] bg-white p-6 shadow-xl">
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#B19A55]" />

                  <h2 className="font-serif text-2xl font-bold">
                    Active Seller Listings
                  </h2>
                </div>

                <div className="mt-6 grid gap-4">
                  {listings.length > 0 ? (
                    listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="rounded-3xl bg-[#F8F5EF] p-4"
                      >
                        <p className="font-serif text-lg font-bold">
                          {listing.seller_name || "Unnamed Seller"}
                        </p>

                        <p className="mt-2 text-sm text-[#1A1A1A]/60">
                          {listing.property_address || "No property address"}
                        </p>

                      <select
                         value={listing.seller_stage || "Active on Market"}
                         onChange={(e) =>
                           updateSellerStage(listing.id, e.target.value)
                         }
                         className="mt-3 rounded-full border border-[#1A1A1A]/10 bg-white px-4 py-2 text-xs"
                       >
                         <option>Listing Preparation</option>
                         <option>Photography & Marketing</option>
                         <option>Active on Market</option>
                         <option>Showing Activity</option>
                         <option>Offer Review</option>
                         <option>Under Contract</option>
                         <option>Inspection & Appraisal</option>
                         <option>Closing Preparation</option>
                         <option>Closed</option>
                       </select>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-3xl bg-[#F8F5EF] p-4 text-sm text-[#1A1A1A]/60">
                      No seller listings yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] bg-[#1A1A1A] p-6 text-white shadow-xl">
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} className="text-[#D4B06A]" />

                  <h2 className="font-serif text-2xl font-bold">
                    Advisor Notes
                  </h2>
                </div>

                <p className="mt-5 text-sm leading-7 text-white/65">
                  {activeListing?.advisor_notes ||
                    "No advisor notes yet. Add a seller listing to begin tracking updates."}
                </p>
              </div>
            </section>

            <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-xl">
              <h2 className="font-serif text-2xl font-bold">
                Seller Transaction Timeline
              </h2>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {timeline.map((step) => {
                  const isActive = step === activeListing?.seller_stage;

                  return (
                    <div
                      key={step}
                      className={`rounded-3xl p-4 ${
                        isActive
                          ? "bg-[#B19A55] text-white"
                          : "bg-[#F8F5EF] text-[#1A1A1A]/65"
                      }`}
                    >
                      <p className="text-[10px] uppercase tracking-[0.2em] opacity-70">
                        Seller Step
                      </p>

                      <p className="mt-2 font-serif text-lg font-bold">{step}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}