"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  RotateCcw,
  Wallet,
  Home,
  ShieldCheck,
  TrendingUp,
  Save,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

function money(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function BudgetCalculatorPage() {
  const [annualIncome, setAnnualIncome] = useState(180000);
  const [monthlyDebt, setMonthlyDebt] = useState(750);
  const [savings, setSavings] = useState(180000);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const results = useMemo(() => {
    const monthlyIncome = annualIncome / 12;

    const maxMonthlyPayment =
      monthlyIncome * 0.36 - monthlyDebt;

    const estimatedHomePrice = Math.max(
      0,
      maxMonthlyPayment * 175
    );

    return {
      monthlyIncome,
      maxMonthlyPayment,
      estimatedHomePrice,
    };
  }, [annualIncome, monthlyDebt]);

  function resetDefaults() {
    setAnnualIncome(180000);
    setMonthlyDebt(750);
    setSavings(180000);
  }

  async function saveBudget() {
    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please login first.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("buyer_budgets")
      .insert({
        user_id: user.id,
        annual_income: annualIncome,
        monthly_debt: monthlyDebt,
        savings: savings,
        estimated_home_price:
          results.estimatedHomePrice,
        estimated_monthly_payment:
          results.maxMonthlyPayment,
      });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Budget saved successfully.");
    }

    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Buyer Financial Center
            </p>

            <h1 className="mt-3 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-tight">
              Budget Calculator
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-[#1A1A1A]/65">
              Estimate affordability, monthly comfort range,
              and realistic buying power.
            </p>
          </div>

          <button
            type="button"
            onClick={resetDefaults}
            className="flex items-center gap-2 rounded-full border border-[#B19A55]/20 bg-[#B19A55]/10 px-6 py-3 font-serif text-[11px] font-bold uppercase tracking-[0.18em] text-[#B19A55] transition hover:bg-[#B19A55] hover:text-white"
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT */}
          <div className="rounded-[1.5rem] border border-[#1A1A1A]/10 bg-white p-6 shadow-sm">
            <div className="mb-8 flex items-center gap-3">
              <Calculator className="text-[#B19A55]" />

              <h2 className="font-serif text-2xl font-bold">
                Financial Inputs
              </h2>
            </div>

            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="font-serif text-sm font-bold">
                  Annual Household Income
                </span>

                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) =>
                    setAnnualIncome(Number(e.target.value))
                  }
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4"
                />
              </label>

              <label className="grid gap-2">
                <span className="font-serif text-sm font-bold">
                  Monthly Debt
                </span>

                <input
                  type="number"
                  value={monthlyDebt}
                  onChange={(e) =>
                    setMonthlyDebt(Number(e.target.value))
                  }
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4"
                />
              </label>

              <label className="grid gap-2">
                <span className="font-serif text-sm font-bold">
                  Savings / Cash Available
                </span>

                <input
                  type="number"
                  value={savings}
                  onChange={(e) =>
                    setSavings(Number(e.target.value))
                  }
                  className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4"
                />
              </label>
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-[1.5rem] border border-[#1A1A1A]/10 bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <Home className="text-[#B19A55]" />

              <h2 className="font-serif text-2xl font-bold">
                Estimated Buying Power
              </h2>
            </div>

            <div className="mt-8 grid gap-5">
              <div className="rounded-3xl bg-[#F8F5EF] p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-[#B19A55]" />

                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                    Estimated Home Budget
                  </p>
                </div>

                <p className="mt-4 font-serif text-4xl font-bold text-[#B19A55]">
                  {money(results.estimatedHomePrice)}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl bg-[#F8F5EF] p-6">
                  <div className="flex items-center gap-3">
                    <Wallet className="text-[#B19A55]" />

                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                      Monthly Comfort
                    </p>
                  </div>

                  <p className="mt-4 font-serif text-3xl font-bold">
                    {money(results.maxMonthlyPayment)}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#F8F5EF] p-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-[#B19A55]" />

                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                      Savings Available
                    </p>
                  </div>

                  <p className="mt-4 font-serif text-3xl font-bold">
                    {money(savings)}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={saveBudget}
              disabled={saving}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749]"
            >
              <Save size={15} />

              {saving ? "Saving..." : "Save Budget"}
            </button>

            {message && (
              <p className="mt-4 text-center text-sm text-[#1A1A1A]/60">
                {message}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}