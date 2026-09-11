"use client";

import Link from "next/link";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <section className="container not-found">
      <p className="eyebrow">A MOMENT PLEASE</p>
      <h1>
        Something didn’t
        <br />
        <em>go to plan.</em>
      </h1>
      <p>Please try loading this page again, or contact our team.</p>
      <button className="button button-dark" onClick={retry}>
        Try again
      </button>
      <Link href="/contact" className="text-link" style={{ marginLeft: 24 }}>
        Contact SLN Infra
      </Link>
    </section>
  );
}
