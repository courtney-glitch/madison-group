"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  RotateCcw,
  Wallet,
  Home,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

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
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.75);
  const [loanYears, setLoanYears] = useState(30);
  const [taxRate, setTaxRate] = useState(1.8);
  const [insurance, setInsurance] = useState(275);
  const [hoa, setHoa] = useState(0);
  const [targetDti, setTargetDti] = useState(36);

  const results = useMemo(() => {
    const monthlyIncome = annualIncome / 12;
    const maxHousingBudget = monthlyIncome * (targetDti / 100) - monthlyDebt;

    const monthlyRate = interestRate / 100 / 12;
    const payments = loanYears * 12;

    let estimatedHomePrice = 0;

    for (let price = 100000; price <= 5000000; price += 5000) {
      const downPayment = price * (downPaymentPercent / 100);
      const loanAmount = price - downPayment;
      const monthlyTaxes = (price * (taxRate / 100)) / 12;

      const principalInterest =
        monthlyRate > 0
          ? loanAmount *
            ((monthlyRate * Math.pow(1 + monthlyRate, payments)) /
              (Math.pow(1 + monthlyRate, payments) - 1))
          : loanAmount / payments;

      const totalPayment =
        principalInterest + monthlyTaxes + insurance + hoa;

      if (totalPayment <= maxHousingBudget && downPayment <= savings) {
        estimatedHomePrice = price;
      }
    }

    const downPayment = estimatedHomePrice * (downPaymentPercent / 100);
    const loanAmount = estimatedHomePrice - downPayment;
    const monthlyTaxes = (estimatedHomePrice * (taxRate / 100)) / 12;

    const principalInterest =
      monthlyRate > 0 && loanAmount > 0
        ? loanAmount *
          ((monthlyRate * Math.pow(1 + monthlyRate, payments)) /
            (Math.pow(1 + monthlyRate, payments) - 1))
        : 0;

    const totalMonthlyPayment =
      principalInterest + monthlyTaxes + insurance + hoa;

    const actualDti =
      monthlyIncome > 0
        ? ((totalMonthlyPayment + monthlyDebt) / monthlyIncome) * 100
        : 0;

    return {
      monthlyIncome,
      maxHousingBudget,
      estimatedHomePrice,
      downPayment,
      loanAmount,
      principalInterest,
      monthlyTaxes,
      totalMonthlyPayment,
      actualDti,
      cashLeftAfterDownPayment: savings - downPayment,
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
    targetDti,
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
    setTargetDti(36);
  }

  return (
    <main className="min-h-screen bg-[#F8F5EF] px-6 pb-20 pt-32 text-[#1A1A1A]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
            BUYER FINANCIAL CENTER
          </p>

          <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-tight md:text-7xl">
            Budget Calculator
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#1A1A1A]/65">
            Estimate what home price may fit your income, savings, monthly debt,
            and comfort level before starting your search.
          </p>
        </div>

        <section className="overflow-hidden rounded-[32px] bg-white shadow-xl">
          <div className="border-b border-[#1A1A1A]/10 px-8 py-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B19A55]/10 text-[#B19A55]">
                  <Calculator size={24} />
                </div>

                <div>
                  <p className="font-serif text-sm tracking-[0.3em] text-[#B19A55]">
                    WHAT CAN I AFFORD?
                  </p>

                  <h2 className="mt-2 font-serif text-3xl font-bold">
                    Buyer Budget Estimate
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={resetDefaults}
                className="flex w-fit items-center gap-2 rounded-full bg-[#B19A55] px-6 py-3 font-serif text-sm font-bold text-white transition hover:opacity-90"
              >
                <RotateCcw size={16} />
                Revert to Default Estimates
              </button>
            </div>
          </div>

          <div className="grid gap-8 p-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-[#1A1A1A]/10 bg-[#F8F5EF] p-8">
              <div className="mb-8 flex items-center gap-3">
                <Wallet className="text-[#B19A55]" />

                <h3 className="font-serif text-2xl font-bold">
                  Buyer Financial Profile
                </h3>
              </div>

              <div className="grid gap-5">
                <InputField
                  label="Annual Household Income"
                  value={annualIncome}
                  onChange={setAnnualIncome}
                />

                <InputField
                  label="Monthly Recurring Debt"
                  value={monthlyDebt}
                  onChange={setMonthlyDebt}
                />

                <InputField
                  label="Available Savings"
                  value={savings}
                  onChange={setSavings}
                />

                <label className="grid gap-2">
                  <span className="font-serif font-bold">
                    Down Payment: {downPaymentPercent}%
                  </span>

                  <input
                    type="range"
                    min="3"
                    max="50"
                    value={downPaymentPercent}
                    onChange={(e) =>
                      setDownPaymentPercent(Number(e.target.value))
                    }
                  />

                  <span className="text-sm text-[#1A1A1A]/55">
                    Estimated down payment: {money(results.downPayment)}
                  </span>
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="Interest Rate %"
                    value={interestRate}
                    onChange={setInterestRate}
                    step="0.01"
                  />

                  <label className="grid gap-2">
                    <span className="font-serif font-bold">Loan Term</span>

                    <select
                      value={loanYears}
                      onChange={(e) => setLoanYears(Number(e.target.value))}
                      className="rounded-xl border border-[#1A1A1A]/10 bg-white px-4 py-4 outline-none"
                    >
                      <option value={30}>30 Years</option>
                      <option value={20}>20 Years</option>
                      <option value={15}>15 Years</option>
                      <option value={10}>10 Years</option>
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <InputField
                    label="Tax %"
                    value={taxRate}
                    onChange={setTaxRate}
                    step="0.01"
                  />

                  <InputField
                    label="Insurance"
                    value={insurance}
                    onChange={setInsurance}
                  />

                  <InputField label="HOA" value={hoa} onChange={setHoa} />
                </div>

                <label className="grid gap-2">
                  <span className="font-serif font-bold">
                    Target Debt-To-Income Ratio: {targetDti}%
                  </span>

                  <input
                    type="range"
                    min="25"
                    max="45"
                    value={targetDti}
                    onChange={(e) => setTargetDti(Number(e.target.value))}
                  />
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-[#1A1A1A]/10 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <Home className="text-[#B19A55]" />

                <h3 className="font-serif text-3xl font-bold">
                  Estimated Buying Power
                </h3>
              </div>

              <p className="mt-8 text-sm uppercase tracking-[0.25em] text-[#1A1A1A]/45">
                Estimated Home Budget
              </p>

              <p className="mt-3 font-serif text-6xl font-bold text-[#B19A55]">
                {money(results.estimatedHomePrice)}
              </p>

              <div className="mt-8 grid gap-4 text-lg">
                <ResultRow
                  label="Estimated Monthly Payment"
                  value={money(results.totalMonthlyPayment)}
                />

                <ResultRow
                  label="Principal & Interest"
                  value={money(results.principalInterest)}
                />

                <ResultRow
                  label="Monthly Taxes"
                  value={money(results.monthlyTaxes)}
                />

                <ResultRow
                  label="Insurance"
                  value={money(insurance)}
                />

                <ResultRow label="HOA" value={money(hoa)} />

                <ResultRow
                  label="Estimated Down Payment"
                  value={money(results.downPayment)}
                />

                <ResultRow
                  label="Estimated Loan Amount"
                  value={money(results.loanAmount)}
                />

                <ResultRow
                  label="Cash Left After Down Payment"
                  value={money(results.cashLeftAfterDownPayment)}
                />

                <ResultRow
                  label="Estimated DTI"
                  value={`${results.actualDti.toFixed(1)}%`}
                />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-[#F8F5EF] p-6">
                  <ShieldCheck className="text-[#B19A55]" />

                  <p className="mt-4 font-serif text-xl font-bold">
                    Planning Estimate
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/60">
                    This helps buyers understand a comfortable starting range
                    before speaking with a lender.
                  </p>
                </div>

                <div className="rounded-3xl bg-[#F8F5EF] p-6">
                  <TrendingUp className="text-[#B19A55]" />

                  <p className="mt-4 font-serif text-xl font-bold">
                    Better Search Strategy
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#1A1A1A]/60">
                    Use this number to search with more confidence and avoid
                    homes outside your comfort zone.
                  </p>
                </div>
              </div>

              <p className="mt-8 text-sm leading-6 text-[#1A1A1A]/55">
                This estimate is for planning only and does not represent loan
                approval, lending advice, or a guaranteed payment.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function InputField({
  label,
  value,
  onChange,
  step = "1",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-serif font-bold">{label}</span>

      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-xl border border-[#1A1A1A]/10 bg-white px-4 py-4 outline-none"
      />
    </label>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-[#1A1A1A]/10 pb-3">
      <span>{label}</span>
      <strong className="text-right">{value}</strong>
    </div>
  );
}