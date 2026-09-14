/**
 * Standard reducing-balance EMI, the formula every Indian lender quotes:
 *
 *   EMI = P · r · (1 + r)^n / ((1 + r)^n − 1)
 *
 * where P is the principal, r the monthly rate (annual ÷ 12 ÷ 100) and n the
 * number of monthly instalments.
 */

export type EmiInput = {
  /** Rupees. */
  price: number;
  /** Rupees paid up front. */
  downPayment: number;
  /** Annual rate as a percentage, e.g. 8.5. */
  ratePercent: number;
  /** Years. */
  tenureYears: number;
};

export type EmiResult = {
  principal: number;
  monthly: number;
  totalInterest: number;
  totalPayable: number;
  months: number;
};

export function calculateEmi({
  price,
  downPayment,
  ratePercent,
  tenureYears,
}: EmiInput): EmiResult {
  const principal = Math.max(0, price - downPayment);
  const months = Math.max(1, Math.round(tenureYears * 12));
  const monthlyRate = ratePercent / 12 / 100;

  // A zero-interest loan is just the principal split evenly; the formula below
  // divides by zero there.
  const monthly =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayable = monthly * months;

  return {
    principal,
    months,
    monthly,
    totalPayable,
    totalInterest: totalPayable - principal,
  };
}

/**
 * Indian digit grouping (1,23,45,678) with a rupee sign, which is what buyers
 * here read fluently — `Intl` with the `en-IN` locale does the grouping.
 */
export function formatRupees(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

/** Compact form for large figures: ₹2.4 Cr, ₹85 L. */
export function formatCompactRupees(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
  return formatRupees(value);
}
