"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  ListChecks,
  Plus,
  RefreshCcw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type TimelineStep = {
  id: string;
  step_key: string;
  step_title: string;
  step_description: string;
  status: "pending" | "active" | "complete";
  sort_order: number;
};

const defaultSteps = [
  {
    step_key: "consultation",
    step_title: "Buyer Consultation",
    step_description:
      "Meet with your Madison Group advisor to clarify goals, timeline, budget, and preferred communities.",
    status: "complete",
    sort_order: 1,
  },
  {
    step_key: "pre_approval",
    step_title: "Mortgage Pre-Approval",
    step_description:
      "Connect with a trusted lender and prepare financing before touring seriously.",
    status: "active",
    sort_order: 2,
  },
  {
    step_key: "home_search",
    step_title: "Home Search",
    step_description:
      "Review listings, save favorites, compare homes, and track notes from tours.",
    status: "pending",
    sort_order: 3,
  },
  {
    step_key: "showings",
    step_title: "Private Showings",
    step_description:
      "Schedule tours and review feedback after visiting properties in person.",
    status: "pending",
    sort_order: 4,
  },
  {
    step_key: "offer",
    step_title: "Offer Strategy",
    step_description:
      "Discuss pricing, terms, contingencies, and submit a competitive offer.",
    status: "pending",
    sort_order: 5,
  },
  {
    step_key: "inspection",
    step_title: "Inspection Period",
    step_description:
      "Coordinate inspection, review findings, and negotiate repairs or credits.",
    status: "pending",
    sort_order: 6,
  },
  {
    step_key: "closing",
    step_title: "Closing Day",
    step_description:
      "Finalize paperwork, transfer funds, receive keys, and begin your next chapter.",
    status: "pending",
    sort_order: 7,
  },
];

export function TransactionTimeline() {
  const [steps, setSteps] = useState<TimelineStep[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimeline();
  }, []);

  async function loadTimeline() {
    setLoading(true);
    setStatus("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("Please login first to view your transaction timeline.");
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("transaction_timelines")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true });

    if (data && data.length > 0) {
      setSteps(data as TimelineStep[]);
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("transaction_timelines").insert(
      defaultSteps.map((step) => ({
        user_id: user.id,
        ...step,
      }))
    );

    if (error) {
      setStatus(error.message);
      setLoading(false);
      return;
    }

    await loadTimeline();
  }

  async function updateStep(stepId: string, newStatus: TimelineStep["status"]) {
    setStatus("");

    const { error } = await supabase
      .from("transaction_timelines")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", stepId);

    if (error) {
      setStatus(error.message);
      return;
    }

    setSteps((current) =>
      current.map((step) =>
        step.id === stepId ? { ...step, status: newStatus } : step
      )
    );
  }

  async function resetTimeline() {
    setStatus("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("transaction_timelines")
      .delete()
      .eq("user_id", user.id);

    setSteps([]);
    await loadTimeline();
  }

  const completeCount = steps.filter((step) => step.status === "complete").length;
  const progress = steps.length > 0 ? Math.round((completeCount / steps.length) * 100) : 0;

  return (
    <section className="rounded-[1.5rem] bg-white p-6 shadow-xl">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <ListChecks className="mt-1 text-[#B19A55]" />

          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Transaction Timeline
            </p>

            <h2 className="mt-2 font-serif text-2xl font-bold">
              Buyer Journey Tracker
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#1A1A1A]/60">
              Track your progress from consultation to closing day with a guided
              Madison Group client journey.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetTimeline}
          className="flex items-center justify-center gap-2 rounded-full border border-[#B19A55]/30 bg-[#B19A55]/10 px-5 py-3 font-serif text-[10px] font-bold uppercase tracking-[0.2em] text-[#B19A55] transition hover:bg-[#B19A55] hover:text-white"
        >
          <RefreshCcw size={14} />
          Reset
        </button>
      </div>

      <div className="mt-8 rounded-3xl bg-[#F8F5EF] p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/45">
              Progress
            </p>

            <p className="mt-2 font-serif text-3xl font-bold text-[#B19A55]">
              {progress}%
            </p>
          </div>

          <p className="text-sm text-[#1A1A1A]/60">
            {completeCount} of {steps.length} steps completed
          </p>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white">
          <div
            className="h-full rounded-full bg-[#B19A55] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {loading ? (
        <p className="mt-8 rounded-3xl bg-[#F8F5EF] p-6 text-sm text-[#1A1A1A]/60">
          Loading timeline...
        </p>
      ) : (
        <div className="mt-8 grid gap-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="rounded-3xl border border-[#1A1A1A]/10 bg-[#F8F5EF] p-5"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <div
                    className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      step.status === "complete"
                        ? "bg-emerald-600 text-white"
                        : step.status === "active"
                        ? "bg-[#B19A55] text-white"
                        : "bg-white text-[#1A1A1A]/30"
                    }`}
                  >
                    {step.status === "complete" ? (
                      <CheckCircle2 size={19} />
                    ) : step.status === "active" ? (
                      <Clock size={19} />
                    ) : (
                      <Circle size={19} />
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#B19A55]">
                      Step {step.sort_order}
                    </p>

                    <h3 className="mt-2 font-serif text-xl font-bold">
                      {step.step_title}
                    </h3>

                    <p className="mt-2 max-w-3xl text-sm leading-7 text-[#1A1A1A]/60">
                      {step.step_description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateStep(step.id, "pending")}
                    className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.18em] ${
                      step.status === "pending"
                        ? "bg-[#1A1A1A] text-white"
                        : "bg-white text-[#1A1A1A]/50"
                    }`}
                  >
                    Pending
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStep(step.id, "active")}
                    className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.18em] ${
                      step.status === "active"
                        ? "bg-[#B19A55] text-white"
                        : "bg-white text-[#1A1A1A]/50"
                    }`}
                  >
                    Active
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStep(step.id, "complete")}
                    className={`rounded-full px-4 py-2 text-[10px] uppercase tracking-[0.18em] ${
                      step.status === "complete"
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-[#1A1A1A]/50"
                    }`}
                  >
                    Complete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {status && (
        <p className="mt-5 rounded-2xl bg-[#F8F5EF] px-4 py-3 text-sm text-[#1A1A1A]/65">
          {status}
        </p>
      )}
    </section>
  );
}