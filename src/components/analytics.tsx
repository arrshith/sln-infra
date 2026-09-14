"use client";

import Script from "next/script";

/**
 * Google Tag Manager, loaded only when a container has been configured.
 *
 * `NEXT_PUBLIC_GTM_ID` is deliberately absent until SLN supplies one: shipping
 * a guessed or placeholder container would either fail silently or, worse,
 * report into someone else's property. Every `track()` call in the app pushes
 * to `window.dataLayer` regardless, so the moment the ID is set the queued and
 * subsequent events start flowing with no other change.
 *
 * `afterInteractive` keeps the container off the critical path — analytics
 * never delays the first paint of a page.
 */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if (!id) return null;

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];`}
      </Script>
      <Script
        id="gtm"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtm.js?id=${id}`}
      />
    </>
  );
}
