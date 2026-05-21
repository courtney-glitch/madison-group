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
  DollarSign,
  BarChart3,
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
  const [tab, setTab] = useState<
    "affordability" | "equity"
  >("affordability");

  const [annualIncome, setAnnualIncome] =
    useState(180000);

  const [monthlyDebt, setMonthlyDebt] =
    useState(750);

  const [savings, setSavings] =
    useState(180000);

  const [downPaymentPercent, setDownPaymentPercent] =
    useState(20);

  const [interestRate, setInterestRate] =
    useState(6.75);

  const [loanYears, setLoanYears] =
    useState(30);

  const [taxRate, setTaxRate] =
    useState(1.8);

  const [insurance, setInsurance] =
    useState(275);

  const [hoa, setHoa] =
    useState(0);

  const [appreciationRate, setAppreciationRate] =
    useState(4.5);

  const [equityYears, setEquityYears] =
    useState(10);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const results = useMemo(() => {
    const monthlyIncome = annualIncome / 12;

    const maxMonthlyPayment =
      monthlyIncome * 0.36 - monthlyDebt;

    const monthlyRate =
      interestRate / 100 / 12;

    const payments = loanYears * 12;

    let estimatedHomePrice = 0;

    for (
      let price = 100000;
      price <= 5000000;
      price += 5000
    ) {
      const downPayment =
        price * (downPaymentPercent / 100);

      const loanAmount =
        price - downPayment;

      const monthlyTaxes =
        (price * (taxRate / 100)) / 12;

      const principalInterest =
        monthlyRate > 0
          ? loanAmount *
            ((monthlyRate *
              Math.pow(
                1 + monthlyRate,
                payments
              )) /
              (Math.pow(
                1 + monthlyRate,
                payments
              ) -
                1))
          : loanAmount / payments;

      const totalPayment =
        principalInterest +
        monthlyTaxes +
        insurance +
        hoa;

      if (
        totalPayment <= maxMonthlyPayment &&
        downPayment <= savings
      ) {
        estimatedHomePrice = price;
      }
    }

    const downPayment =
      estimatedHomePrice *
      (downPaymentPercent / 100);

    const loanAmount =
      estimatedHomePrice - downPayment;

    const monthlyTaxes =
      (estimatedHomePrice *
        (taxRate / 100)) /
      12;

    const principalInterest =
      monthlyRate > 0 && loanAmount > 0
        ? loanAmount *
          ((monthlyRate *
            Math.pow(
              1 + monthlyRate,
              payments
            )) /
            (Math.pow(
              1 + monthlyRate,
              payments
            ) -
              1))
        : 0;

    const totalMonthlyPayment =
      principalInterest +
      monthlyTaxes +
      insurance +
      hoa;

    const actualDti =
      monthlyIncome > 0
        ? (
            ((totalMonthlyPayment +
              monthlyDebt) /
              monthlyIncome) *
            100
          ).toFixed(1)
        : "0";

    const futureValue =
      estimatedHomePrice *
      Math.pow(
        1 + appreciationRate / 100,
        equityYears
      );

    const equityGain =
      futureValue - estimatedHomePrice;

    return {
      monthlyIncome,
      maxMonthlyPayment,
      estimatedHomePrice,
      downPayment,
      loanAmount,
      totalMonthlyPayment,
      actualDti,
      futureValue,
      equityGain,
    };
  }, [
    annualIncome,
    monthlyDebt,
    savings,
    downPaymentPercent,
    interestRate,
    loanYears,
    taxRate,
    insurance,
    hoa,
    appreciationRate,
    equityYears,
  ]);

  function resetDefaults() {
    setAnnualIncome(180000);
    setMonthlyDebt(750);
    setSavings(180000);
    setDownPaymentPercent(20);
    setInterestRate(6.75);
    setLoanYears(30);
    setTaxRate(1.8);
    setInsurance(275);
    setHoa(0);
    setAppreciationRate(4.5);
    setEquityYears(10);
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
          results.totalMonthlyPayment,
      });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Budget saved successfully."
      );
    }

    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 py-12 text-[#1A1A1A]">
      <section className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-[11px] uppercase tracking-[0.32em] text-[#B19A55]">
              Buyer Financial Center
            </p>

            <h1 className="mt-3 font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-tight">
              Budget Calculator
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-8 text-[#1A1A1A]/65">
              Advanced affordability, equity,
              and buying power analysis.
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

        {/* TABS */}
        <div className="mt-10 flex gap-6 border-b border-[#1A1A1A]/10">
          <button
            onClick={() =>
              setTab("affordability")
            }
            className={`pb-4 font-serif text-lg ${
              tab === "affordability"
                ? "border-b-2 border-[#B19A55] text-[#B19A55]"
                : "text-[#1A1A1A]/40"
            }`}
          >
            Affordability
          </button>

          <button
            onClick={() => setTab("equity")}
            className={`pb-4 font-serif text-lg ${
              tab === "equity"
                ? "border-b-2 border-[#B19A55] text-[#B19A55]"
                : "text-[#1A1A1A]/40"
            }`}
          >
            Equity Growth
          </button>
        </div>

        {tab === "affordability" ? (
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            {/* INPUTS */}
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
                    Annual Income
                  </span>

                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) =>
                      setAnnualIncome(
                        Number(e.target.value)
                      )
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
                      setMonthlyDebt(
                        Number(e.target.value)
                      )
                    }
                    className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="font-serif text-sm font-bold">
                    Savings
                  </span>

                  <input
                    type="number"
                    value={savings}
                    onChange={(e) =>
                      setSavings(
                        Number(e.target.value)
                      )
                    }
                    className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="font-serif text-sm font-bold">
                    Down Payment %
                  </span>

                  <input
                    type="range"
                    min="3"
                    max="50"
                    value={downPaymentPercent}
                    onChange={(e) =>
                      setDownPaymentPercent(
                        Number(e.target.value)
                      )
                    }
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="font-serif text-sm font-bold">
                      Interest Rate %
                    </span>

                    <input
                      type="number"
                      step="0.01"
                      value={interestRate}
                      onChange={(e) =>
                        setInterestRate(
                          Number(e.target.value)
                        )
                      }
                      className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="font-serif text-sm font-bold">
                      Loan Years
                    </span>

                    <select
                      value={loanYears}
                      onChange={(e) =>
                        setLoanYears(
                          Number(e.target.value)
                        )
                      }
                      className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4"
                    >
                      <option value={30}>
                        30 Years
                      </option>

                      <option value={20}>
                        20 Years
                      </option>

                      <option value={15}>
                        15 Years
                      </option>
                    </select>
                  </label>
                </div>
              </div>
            </div>

            {/* RESULTS */}
            <div className="rounded-[1.5rem] border border-[#1A1A1A]/10 bg-white p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <Home className="text-[#B19A55]" />

                <h2 className="font-serif text-2xl font-bold">
                  Buying Power
                </h2>
              </div>

              <div className="mt-8 rounded-3xl bg-[#F8F5EF] p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-[#B19A55]" />

                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                    Estimated Home Budget
                  </p>
                </div>

                <p className="mt-4 font-serif text-5xl font-bold text-[#B19A55]">
                  {money(
                    results.estimatedHomePrice
                  )}
                </p>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl bg-[#F8F5EF] p-6">
                  <div className="flex items-center gap-3">
                    <Wallet className="text-[#B19A55]" />

                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                      Monthly Payment
                    </p>
                  </div>

                  <p className="mt-4 font-serif text-3xl font-bold">
                    {money(
                      results.totalMonthlyPayment
                    )}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#F8F5EF] p-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-[#B19A55]" />

                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                      Debt To Income
                    </p>
                  </div>

                  <p className="mt-4 font-serif text-3xl font-bold">
                    {results.actualDti}%
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={saveBudget}
                disabled={saving}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#B19A55] px-6 py-4 font-serif text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#9C8749]"
              >
                <Save size={15} />

                {saving
                  ? "Saving..."
                  : "Save Budget"}
              </button>

              {message && (
                <p className="mt-4 text-center text-sm text-[#1A1A1A]/60">
                  {message}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-[1.5rem] border border-[#1A1A1A]/10 bg-white p-8 shadow-xl">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-[#B19A55]" />

              <h2 className="font-serif text-3xl font-bold">
                Equity Projection
              </h2>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div>
                <label className="grid gap-2">
                  <span className="font-serif text-sm font-bold">
                    Appreciation %
                  </span>

                  <input
                    type="number"
                    step="0.1"
                    value={appreciationRate}
                    onChange={(e) =>
                      setAppreciationRate(
                        Number(e.target.value)
                      )
                    }
                    className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4"
                  />
                </label>

                <label className="mt-5 grid gap-2">
                  <span className="font-serif text-sm font-bold">
                    Years
                  </span>

                  <input
                    type="number"
                    value={equityYears}
                    onChange={(e) =>
                      setEquityYears(
                        Number(e.target.value)
                      )
                    }
                    className="rounded-2xl border border-[#1A1A1A]/10 bg-[#F8F5EF] px-4 py-4"
                  />
                </label>
              </div>

              <div className="grid gap-5">
                <div className="rounded-3xl bg-[#F8F5EF] p-6">
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-[#B19A55]" />

                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                      Future Home Value
                    </p>
                  </div>

                  <p className="mt-4 font-serif text-4xl font-bold text-[#B19A55]">
                    {money(results.futureValue)}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#F8F5EF] p-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-[#B19A55]" />

                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                      Estimated Equity Gain
                    </p>
                  </div>

                  <p className="mt-4 font-serif text-4xl font-bold">
                    {money(results.equityGain)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}