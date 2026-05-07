"use client";

import { useMemo, useState } from "react";

type MortgageCalculatorProps = {
  price: string;
};

export function MortgageCalculator({
  price,
}: MortgageCalculatorProps) {
  const numericPrice = Number(
    price.replace(/[^0-9]/g, "")
  );

  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [years, setYears] = useState(30);

  const monthlyPayment = useMemo(() => {
    const loanAmount =
      numericPrice * (1 - downPayment / 100);

    const monthlyRate = interestRate / 100 / 12;

    const numberOfPayments = years * 12;

    const payment =
      (loanAmount *
        monthlyRate *
        Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    if (isNaN(payment)) return 0;

    return payment.toFixed(0);
  }, [numericPrice, downPayment, interestRate, years]);

  return (
    <section className="mt-16 border border-[#1A1A1A]/10 p-8">
      <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
        PAYMENT ESTIMATE
      </p>

      <h2 className="mt-3 font-serif text-4xl font-bold">
        Mortgage Calculator
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div>
          <label className="block font-serif text-sm font-bold">
            Down Payment (%)
          </label>

          <input
            type="number"
            value={downPayment}
            onChange={(e) =>
              setDownPayment(Number(e.target.value))
            }
            className="mt-2 w-full border border-[#1A1A1A]/20 px-4 py-3"
          />
        </div>

        <div>
          <label className="block font-serif text-sm font-bold">
            Interest Rate (%)
          </label>

          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) =>
              setInterestRate(Number(e.target.value))
            }
            className="mt-2 w-full border border-[#1A1A1A]/20 px-4 py-3"
          />
        </div>

        <div>
          <label className="block font-serif text-sm font-bold">
            Loan Term (Years)
          </label>

          <input
            type="number"
            value={years}
            onChange={(e) =>
              setYears(Number(e.target.value))
            }
            className="mt-2 w-full border border-[#1A1A1A]/20 px-4 py-3"
          />
        </div>
      </div>

      <div className="mt-10 border-t border-[#1A1A1A]/10 pt-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">
          Estimated Monthly Payment
        </p>

        <p className="mt-3 font-serif text-5xl font-bold">
          ${Number(monthlyPayment).toLocaleString()}
        </p>
      </div>
    </section>
  );
}