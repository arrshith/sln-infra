"use client";

import { useId, useMemo, useState } from "react";
import { calculateEmi, formatCompactRupees, formatRupees } from "@/lib/emi";
import { trackOnce } from "@/lib/analytics";
import type { Money } from "@/lib/content";

/**
 * A reducing-balance EMI calculator, drawn as part of the sheet rather than as
 * a widget dropped onto it: figures set in the display serif, controls as
 * hairline rules, and the split between principal and interest shown as a
 * single measured bar instead of a pie chart.
 *
 * When SLN has published a starting price for the community it seeds the
 * calculation; when they have not, the visitor's own figure does, and the panel
 * says so rather than implying a price we do not have.
 */

const RATE = { min: 6, max: 14, step: 0.05 };
const TENURE = { min: 5, max: 30, step: 1 };
/** Bounds only — never a suggestion about what an SLN home costs. */
const PRICE = { min: 2500000, max: 250000000, step: 100000 };

export function EmiCalculator({
  priceFrom,
  projectSlug,
}: {
  priceFrom?: Money;
  projectSlug?: string;
}) {
  const id = useId();
  const [price, setPrice] = useState(priceFrom?.amount ?? 15000000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [ratePercent, setRatePercent] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  const downPayment = Math.round((price * downPaymentPct) / 100);
  const result = useMemo(
    () => calculateEmi({ price, downPayment, ratePercent, tenureYears }),
    [price, downPayment, ratePercent, tenureYears],
  );

  const interestShare = result.totalPayable
    ? (result.totalInterest / result.totalPayable) * 100
    : 0;

  const note = () => trackOnce("emi", { event: "emi_calculator_use", project: projectSlug });

  return (
    <div className="emi">
      <div className="emi-controls">
        <Field
          id={`${id}-price`}
          label="Property price"
          value={formatCompactRupees(price)}
        >
          <input
            id={`${id}-price`}
            type="range"
            min={PRICE.min}
            max={PRICE.max}
            step={PRICE.step}
            value={price}
            onChange={(e) => {
              setPrice(Number(e.target.value));
              note();
            }}
            aria-valuetext={formatRupees(price)}
          />
        </Field>

        <Field
          id={`${id}-down`}
          label="Down payment"
          value={`${downPaymentPct}% · ${formatCompactRupees(downPayment)}`}
        >
          <input
            id={`${id}-down`}
            type="range"
            min={10}
            max={80}
            step={1}
            value={downPaymentPct}
            onChange={(e) => {
              setDownPaymentPct(Number(e.target.value));
              note();
            }}
            aria-valuetext={`${downPaymentPct} percent, ${formatRupees(downPayment)}`}
          />
        </Field>

        <Field
          id={`${id}-rate`}
          label="Interest rate"
          value={`${ratePercent.toFixed(2)}% p.a.`}
        >
          <input
            id={`${id}-rate`}
            type="range"
            min={RATE.min}
            max={RATE.max}
            step={RATE.step}
            value={ratePercent}
            onChange={(e) => {
              setRatePercent(Number(e.target.value));
              note();
            }}
            aria-valuetext={`${ratePercent.toFixed(2)} percent per annum`}
          />
        </Field>

        <Field
          id={`${id}-tenure`}
          label="Loan tenure"
          value={`${tenureYears} years`}
        >
          <input
            id={`${id}-tenure`}
            type="range"
            min={TENURE.min}
            max={TENURE.max}
            step={TENURE.step}
            value={tenureYears}
            onChange={(e) => {
              setTenureYears(Number(e.target.value));
              note();
            }}
            aria-valuetext={`${tenureYears} years`}
          />
        </Field>
      </div>

      <div className="emi-result">
        <p className="label muted">Monthly instalment</p>
        <p className="emi-figure" aria-live="polite">
          {formatRupees(result.monthly)}
        </p>

        <dl className="emi-breakdown">
          <div>
            <dt className="label muted">Loan amount</dt>
            <dd>{formatRupees(result.principal)}</dd>
          </div>
          <div>
            <dt className="label muted">Total interest</dt>
            <dd>{formatRupees(result.totalInterest)}</dd>
          </div>
          <div>
            <dt className="label muted">Total repayable</dt>
            <dd>{formatRupees(result.totalPayable)}</dd>
          </div>
        </dl>

        {/* Principal against interest, measured out along one rule. */}
        <div className="emi-split" aria-hidden="true">
          <span
            className="emi-split-principal"
            style={{ flexBasis: `${100 - interestShare}%` }}
          />
          <span
            className="emi-split-interest"
            style={{ flexBasis: `${interestShare}%` }}
          />
        </div>
        <p className="emi-split-key label muted">
          <span className="emi-key-principal" /> Principal
          <span className="emi-key-interest" /> Interest
        </p>

        <p className="emi-note">
          {priceFrom
            ? `Based on ${priceFrom.display}. An indicative calculation — your lender's terms apply.`
            : "Figures are your own. SLN's pricing for this community is available on request."}
        </p>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  children,
}: {
  id: string;
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="emi-field">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <span className="emi-value">{value}</span>
      {children}
    </div>
  );
}
