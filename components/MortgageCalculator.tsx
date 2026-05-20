"use client";

import { useMemo, useState } from "react";

type MortgageCalculatorProps = {
  price: string;
};

function parsePrice(price: string) {
  return Number(price.replace(/[^0-9]/g, "")) || 0;
}

export function MortgageCalculator({ price }: MortgageCalculatorProps) {
  const homePrice = parsePrice(price);

  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.75);
  const [loanYears, setLoanYears] = useState(30);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.8);
  const [insuranceMonthly, setInsuranceMonthly] = useState(250);
  const [hoaMonthly, setHoaMonthly] = useState(0);

  const results = useMemo(() => {
    const downPayment = homePrice * (downPaymentPercent / 100);
    const loanAmount = homePrice - downPayment;

    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanYears * 12;

    const principalAndInterest =
      monthlyInterestRate > 0
        ? loanAmount *
          ((monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
            (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1))
        : loanAmount / numberOfPayments;

    const monthlyTaxes = (homePrice * (propertyTaxRate / 100)) / 12;

    const totalMonthly =
      principalAndInterest + monthlyTaxes + insuranceMonthly + hoaMonthly;

    return {
      downPayment,
      loanAmount,
      principalAndInterest,
      monthlyTaxes,
      insuranceMonthly,
      hoaMonthly,
      totalMonthly,
    };
  }, [
    homePrice,
    downPaymentPercent,
    interestRate,
    loanYears,
    propertyTaxRate,
    insuranceMonthly,
    hoaMonthly,
  ]);

  function money(value: number) {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
  }

  if (!homePrice) {
    return (
      <section className="bg-white p-8 shadow-xl">
        <p className="font-serif text-2xl font-bold">
          Mortgage Calculator Unavailable
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white p-8 shadow-xl">
      <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
        BUYER BUDGETING TOOL
      </p>

      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-serif text-4xl font-bold">
            Monthly Payment Estimate
          </h2>

          <p className="mt-4 max-w-2xl leading-8 text-[#1A1A1A]/65">
            Adjust down payment, interest rate, taxes, insurance, and HOA costs
            to estimate a monthly payment for this property.
          </p>
        </div>

        <div className="bg-[#1A1A1A] px-8 py-6 text-white">
          <p className="text-sm uppercase tracking-[0.25em] text-white/50">
            Estimated Monthly
          </p>

          <p className="mt-2 font-serif text-5xl font-bold text-[#D4B06A]">
            {money(results.totalMonthly)}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="font-serif text-sm font-bold">
              Down Payment: {downPaymentPercent}%
            </span>

            <input
              type="range"
              min="3"
              max="50"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            />

            <span className="text-sm text-[#1A1A1A]/60">
              {money(results.downPayment)}
            </span>
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="font-serif text-sm font-bold">
                Interest Rate %
              </span>

              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="border border-[#1A1A1A]/20 px-4 py-3"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-serif text-sm font-bold">
                Loan Term
              </span>

              <select
                value={loanYears}
                onChange={(e) => setLoanYears(Number(e.target.value))}
                className="border border-[#1A1A1A]/20 bg-white px-4 py-3"
              >
                <option value={30}>30 Years</option>
                <option value={20}>20 Years</option>
                <option value={15}>15 Years</option>
                <option value={10}>10 Years</option>
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <label className="grid gap-2">
              <span className="font-serif text-sm font-bold">
                Property Tax %
              </span>

              <input
                type="number"
                step="0.01"
                value={propertyTaxRate}
                onChange={(e) => setPropertyTaxRate(Number(e.target.value))}
                className="border border-[#1A1A1A]/20 px-4 py-3"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-serif text-sm font-bold">
                Insurance / Month
              </span>

              <input
                type="number"
                value={insuranceMonthly}
                onChange={(e) => setInsuranceMonthly(Number(e.target.value))}
                className="border border-[#1A1A1A]/20 px-4 py-3"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-serif text-sm font-bold">
                HOA / Month
              </span>

              <input
                type="number"
                value={hoaMonthly}
                onChange={(e) => setHoaMonthly(Number(e.target.value))}
                className="border border-[#1A1A1A]/20 px-4 py-3"
              />
            </label>
          </div>
        </div>

        <div className="border border-[#1A1A1A]/10 bg-[#F8F5EF] p-6">
          <p className="font-serif text-2xl font-bold">
            Payment Breakdown
          </p>

          <div className="mt-6 grid gap-4">
            <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-3">
              <span>Principal & Interest</span>
              <strong>{money(results.principalAndInterest)}</strong>
            </div>

            <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-3">
              <span>Estimated Taxes</span>
              <strong>{money(results.monthlyTaxes)}</strong>
            </div>

            <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-3">
              <span>Homeowners Insurance</span>
              <strong>{money(results.insuranceMonthly)}</strong>
            </div>

            <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-3">
              <span>HOA Fees</span>
              <strong>{money(results.hoaMonthly)}</strong>
            </div>

            <div className="flex justify-between pt-3 font-serif text-2xl font-bold text-[#B19A55]">
              <span>Total</span>
              <span>{money(results.totalMonthly)}</span>
            </div>
          </div>

          <p className="mt-6 text-sm leading-6 text-[#1A1A1A]/55">
            This estimate is for planning purposes only and does not represent
            a loan approval, quote, or financial advice.
          </p>
        </div>
      </div>
    </section>
  );
}