"use client";

import { useMemo, useState } from "react";
import { Home, TrendingUp, DollarSign, RotateCcw } from "lucide-react";

type BuyerFinancialCenterProps = {
  price: string;
};

function parsePrice(price: string) {
  return Number(price.replace(/[^0-9]/g, "")) || 0;
}

function money(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function BuyerFinancialCenter({
  price,
}: BuyerFinancialCenterProps) {
  const homePrice = parsePrice(price);

  const [tab, setTab] = useState<"affordability" | "equity">(
    "affordability"
  );

  const [income, setIncome] = useState(180000);
  const [monthlyDebt, setMonthlyDebt] = useState(750);
  const [downPaymentPercent, setDownPaymentPercent] =
    useState(20);
  const [interestRate, setInterestRate] = useState(6.75);
  const [loanYears, setLoanYears] = useState(30);
  const [taxRate, setTaxRate] = useState(1.8);
  const [insurance, setInsurance] = useState(275);
  const [hoa, setHoa] = useState(0);

  const [appreciationRate, setAppreciationRate] =
    useState(4.5);
  const [equityYears, setEquityYears] = useState(10);

  const results = useMemo(() => {
    const downPayment =
      homePrice * (downPaymentPercent / 100);

    const loanAmount = homePrice - downPayment;

    const monthlyRate =
      interestRate / 100 / 12;

    const payments = loanYears * 12;

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

    const taxes =
      (homePrice * (taxRate / 100)) / 12;

    const totalMonthly =
      principalInterest +
      taxes +
      insurance +
      hoa;

    const monthlyIncome = income / 12;

    const dti =
      ((totalMonthly + monthlyDebt) /
        monthlyIncome) *
      100;

    const futureValue =
      homePrice *
      Math.pow(
        1 + appreciationRate / 100,
        equityYears
      );

    const valueGain =
      futureValue - homePrice;

    const principalPaid = Math.min(
      loanAmount,
      principalInterest *
        equityYears *
        12 *
        0.32
    );

    const totalEquity =
      downPayment +
      valueGain +
      principalPaid;

    return {
      downPayment,
      loanAmount,
      principalInterest,
      taxes,
      totalMonthly,
      dti,
      futureValue,
      valueGain,
      principalPaid,
      totalEquity,
    };
  }, [
    homePrice,
    downPaymentPercent,
    interestRate,
    loanYears,
    taxRate,
    insurance,
    hoa,
    income,
    monthlyDebt,
    appreciationRate,
    equityYears,
  ]);

  function resetDefaults() {
    setIncome(180000);
    setMonthlyDebt(750);
    setDownPaymentPercent(20);
    setInterestRate(6.75);
    setLoanYears(30);
    setTaxRate(1.8);
    setInsurance(275);
    setHoa(0);
    setAppreciationRate(4.5);
    setEquityYears(10);
  }

  if (!homePrice) {
    return (
      <section className="bg-white p-8 shadow-xl">
        <p className="font-serif text-2xl font-bold">
          Buyer Financial Center Unavailable
        </p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-white shadow-xl">
      <div className="border-b border-[#1A1A1A]/10 px-8 py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-serif text-sm tracking-[0.35em] text-[#B19A55]">
              BUYER FINANCIAL CENTER
            </p>

            <h2 className="mt-3 font-serif text-4xl font-bold">
              Starting Budget
            </h2>
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

        <div className="mt-8 flex gap-8 border-b border-[#1A1A1A]/10">
          <button
            type="button"
            onClick={() =>
              setTab("affordability")
            }
            className={`pb-4 font-serif text-lg transition ${
              tab === "affordability"
                ? "border-b-2 border-[#B19A55] text-[#B19A55]"
                : "text-[#1A1A1A]/50"
            }`}
          >
            Affordability
          </button>

          <button
            type="button"
            onClick={() =>
              setTab("equity")
            }
            className={`pb-4 font-serif text-lg transition ${
              tab === "equity"
                ? "border-b-2 border-[#B19A55] text-[#B19A55]"
                : "text-[#1A1A1A]/50"
            }`}
          >
            Equity
          </button>
        </div>
      </div>

      {tab === "affordability" ? (
        <div className="grid gap-8 p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-[#1A1A1A]/10 bg-[#F8F5EF] p-8">
            <div className="mb-8 flex items-center gap-3">
              <Home className="text-[#B19A55]" />

              <h3 className="font-serif text-2xl font-bold">
                Financial Details
              </h3>
            </div>

            <div className="grid gap-5">
              <label className="grid gap-2">
                <span className="font-serif font-bold">
                  Annual Household Income
                </span>

                <input
                  type="number"
                  value={income}
                  onChange={(e) =>
                    setIncome(
                      Number(e.target.value)
                    )
                  }
                  className="rounded-xl border border-[#1A1A1A]/10 bg-white px-4 py-4 outline-none"
                />
              </label>

              <label className="grid gap-2">
                <span className="font-serif font-bold">
                  Monthly Recurring Debt
                </span>

                <input
                  type="number"
                  value={monthlyDebt}
                  onChange={(e) =>
                    setMonthlyDebt(
                      Number(e.target.value)
                    )
                  }
                  className="rounded-xl border border-[#1A1A1A]/10 bg-white px-4 py-4 outline-none"
                />
              </label>

              <label className="grid gap-2">
                <span className="font-serif font-bold">
                  Down Payment:{" "}
                  {downPaymentPercent}%
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

                <span className="text-sm text-[#1A1A1A]/55">
                  {money(results.downPayment)}
                </span>
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="font-serif font-bold">
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
                    className="rounded-xl border border-[#1A1A1A]/10 bg-white px-4 py-4 outline-none"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="font-serif font-bold">
                    Loan Term
                  </span>

                  <select
                    value={loanYears}
                    onChange={(e) =>
                      setLoanYears(
                        Number(e.target.value)
                      )
                    }
                    className="rounded-xl border border-[#1A1A1A]/10 bg-white px-4 py-4 outline-none"
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

                    <option value={10}>
                      10 Years
                    </option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2">
                  <span className="font-serif font-bold">
                    Tax %
                  </span>

                  <input
                    type="number"
                    step="0.01"
                    value={taxRate}
                    onChange={(e) =>
                      setTaxRate(
                        Number(e.target.value)
                      )
                    }
                    className="rounded-xl border border-[#1A1A1A]/10 bg-white px-4 py-4 outline-none"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="font-serif font-bold">
                    Insurance
                  </span>

                  <input
                    type="number"
                    value={insurance}
                    onChange={(e) =>
                      setInsurance(
                        Number(e.target.value)
                      )
                    }
                    className="rounded-xl border border-[#1A1A1A]/10 bg-white px-4 py-4 outline-none"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="font-serif font-bold">
                    HOA
                  </span>

                  <input
                    type="number"
                    value={hoa}
                    onChange={(e) =>
                      setHoa(
                        Number(e.target.value)
                      )
                    }
                    className="rounded-xl border border-[#1A1A1A]/10 bg-white px-4 py-4 outline-none"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#1A1A1A]/10 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <DollarSign className="text-[#B19A55]" />

              <h3 className="font-serif text-3xl font-bold">
                Monthly Housing Expenses
              </h3>
            </div>

            <p className="mt-6 font-serif text-6xl font-bold text-[#B19A55]">
              {money(results.totalMonthly)}
            </p>

            <div className="mt-8 grid gap-4 text-lg">
              <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-3">
                <span>Mortgage Payment</span>

                <strong>
                  {money(
                    results.principalInterest
                  )}
                </strong>
              </div>

              <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-3">
                <span>Taxes</span>

                <strong>
                  {money(results.taxes)}
                </strong>
              </div>

              <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-3">
                <span>
                  Homeowner&apos;s Insurance
                </span>

                <strong>
                  {money(insurance)}
                </strong>
              </div>

              <div className="flex justify-between border-b border-[#1A1A1A]/10 pb-3">
                <span>HOA</span>

                <strong>
                  {money(hoa)}
                </strong>
              </div>

              <div className="flex justify-between pt-3">
                <span>
                  Debt To Income Ratio
                </span>

                <strong>
                  {results.dti.toFixed(1)}%
                </strong>
              </div>
            </div>

            <p className="mt-8 text-sm leading-6 text-[#1A1A1A]/55">
              This estimate is for planning only and does not represent loan approval, lending advice, or a guaranteed payment.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-8">
          <div className="max-w-6xl">
            <h3 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
              If this home increases in value{" "}
              <input
                type="number"
                step="0.1"
                value={appreciationRate}
                onChange={(e) =>
                  setAppreciationRate(
                    Number(e.target.value)
                  )
                }
                className="mx-2 inline-block w-24 rounded border-2 border-[#B19A55] bg-[#F8F5EF] px-3 py-1 text-center text-3xl text-[#1A1A1A]"
              />{" "}
              percent per year, in year{" "}
              <input
                type="number"
                value={equityYears}
                onChange={(e) =>
                  setEquityYears(
                    Number(e.target.value)
                  )
                }
                className="mx-2 inline-block w-24 rounded border-2 border-[#B19A55] bg-[#F8F5EF] px-3 py-1 text-center text-3xl text-[#1A1A1A]"
              />{" "}
              it may have gained{" "}
              <span className="text-purple-500">
                {money(results.valueGain)}
              </span>{" "}
              in value.
            </h3>

            <p className="mt-6 max-w-5xl font-serif text-4xl font-bold leading-tight">
              This gain combined with{" "}
              <span className="text-[#B19A55]">
                {money(
                  results.principalPaid
                )}
              </span>{" "}
              of principal paid means projected home equity of{" "}
              <span className="text-emerald-500">
                {money(
                  results.totalEquity
                )}
              </span>
              .
            </p>
          </div>

          <div className="mt-14 h-72 rounded-3xl border border-[#1A1A1A]/10 bg-[#F8F5EF] p-8">
            <div className="flex h-full items-end gap-1">
              {Array.from({
                length: 48,
              }).map((_, index) => {
                const growth =
                  ((index + 1) / 48) *
                  100;

                const height =
                  20 + growth * 0.75;

                return (
                  <div
                    key={index}
                    className="flex flex-1 flex-col justify-end gap-1"
                  >
                    <div
                      className="rounded-t bg-blue-500"
                      style={{
                        height: `${height}%`,
                      }}
                    />

                    <div
                      className="rounded-t bg-purple-500"
                      style={{
                        height: `${
                          height * 0.65
                        }%`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <TrendingUp className="text-[#B19A55]" />

              <p className="mt-4 font-serif text-3xl font-bold">
                {money(
                  results.futureValue
                )}
              </p>

              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/45">
                Projected Home Value
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <p className="font-serif text-3xl font-bold text-purple-500">
                {money(results.valueGain)}
              </p>

              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/45">
                Estimated Appreciation
              </p>
            </div>

            <div className="rounded-3xl bg-white p-7 shadow-sm">
              <p className="font-serif text-3xl font-bold text-emerald-500">
                {money(
                  results.totalEquity
                )}
              </p>

              <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/45">
                Projected Equity
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}