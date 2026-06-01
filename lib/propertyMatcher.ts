type PropertyMatchInput = {
  buyerCity?: string | null;
  buyerMinPrice?: number | null;
  buyerMaxPrice?: number | null;
  propertyCity?: string | null;
  propertyPrice?: number | null;
};

export function calculatePropertyMatch({
  buyerCity,
  buyerMinPrice,
  buyerMaxPrice,
  propertyCity,
  propertyPrice,
}: PropertyMatchInput) {
  let score = 0;
  const reasons: string[] = [];

  if (buyerCity && propertyCity && buyerCity.toLowerCase() === propertyCity.toLowerCase()) {
    score += 40;
    reasons.push("Matches preferred city");
  }

  if (
    propertyPrice &&
    buyerMinPrice &&
    buyerMaxPrice &&
    propertyPrice >= buyerMinPrice &&
    propertyPrice <= buyerMaxPrice
  ) {
    score += 40;
    reasons.push("Fits saved price range");
  }

  if (
    propertyPrice &&
    buyerMaxPrice &&
    propertyPrice <= buyerMaxPrice
  ) {
    score += 20;
    reasons.push("Within budget range");
  }

  return {
    score,
    label: score >= 70 ? "Strong Match" : score >= 40 ? "Good Match" : "Light Match",
    reasons,
  };
}