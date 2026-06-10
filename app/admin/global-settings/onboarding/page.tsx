"use client";

import { useState } from "react";
import { CheckCircle2, Save, Users } from "lucide-react";
import { AdminPageShell } from "@/components/AdminPageShell";

const defaultSteps = [
  "Create client account",
  "Complete buyer profile",
  "Set budget range",
  "Save favorite homes",
  "Schedule consultation",
  "Start live chat with advisor",
];

export default function OnboardingSettingsPage() {
  const [steps, setSteps] = useState(defaultSteps);
  const [newStep, setNewStep] = useState("");
  const [status, setStatus] = useState("");

  function addStep() {
    if (!newStep.trim()) return;

    setSteps([...steps, newStep.trim()]);
    setNewStep("");
  }

  function removeStep(index: number) {
    setSteps(steps.filter((_, itemIndex) => itemIndex !== index));
  }

  function saveSettings() {
    setStatus("Onboarding settings saved locally. Database saving can be connected next.");
  }

  return (
    <AdminPageShell>
      <main className="min-h-screen bg-[#F8F5EF] px-4 py-8 text-[#1A1A1A] md:px-6 md:py-12">
        <section className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
              <Users size={20} />
            </div>

            <div>
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
                Client Journey
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold md:text-5xl">
                Onboarding Settings
              </h1>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
            <section className="rounded-[2rem] bg-white p-6 shadow-xl">
              <h2 className="font-serif text-2xl font-bold">
                Client Onboarding Steps
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#1A1A1A]/60">
                Customize the steps clients see when they begin their Madison
                journey.
              </p>

              <div className="mt-6 grid gap-3">
                {steps.map((step, index) => (
                  <div
                    key={`${step}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-[#F8F5EF] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={16} className="text-[#B19A55]" />

                      <p className="text-sm text-[#1A1A1A]/75">{step}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="rounded-full bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#1A1A1A]/50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 md:flex-row">
                <input
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  placeholder="Add onboarding step"
                  className="flex-1 rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4 text-sm outline-none focus:border-[#B19A55]"
                />

                <button
                  type="button"
                  onClick={addStep}
                  className="rounded-full bg-[#1A1A1A] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  Add Step
                </button>
              </div>

              <button
                type="button"
                onClick={saveSettings}
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white"
              >
                <Save size={15} />
                Save Onboarding
              </button>

              {status && (
                <p className="mt-4 rounded-2xl bg-[#F8F5EF] px-4 py-3 text-sm text-[#1A1A1A]/60">
                  {status}
                </p>
              )}
            </section>

            <section className="rounded-[2rem] bg-[#1A1A1A] p-6 text-white shadow-xl">
              <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#D4B06A]">
                Preview
              </p>

              <h2 className="mt-5 font-serif text-4xl font-bold">
                Welcome to Madison
              </h2>

              <p className="mt-4 text-sm leading-7 text-white/65">
                This is how the client onboarding journey can be structured
                inside the portal.
              </p>

              <div className="mt-8 grid gap-3">
                {steps.map((step, index) => (
                  <div
                    key={`preview-${step}-${index}`}
                    className="rounded-2xl bg-white/10 px-4 py-3"
                  >
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[#D4B06A]">
                      Step {index + 1}
                    </p>

                    <p className="mt-1 text-sm text-white/80">{step}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </AdminPageShell>
  );
}