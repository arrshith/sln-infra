import { validateEnquiry } from "@/lib/enquiry";
import { recordLead } from "@/lib/leads";
import type { LeadSource } from "@/lib/leads";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return Response.json({ error: "JSON is required." }, { status: 415 });
  const reader = request.body?.getReader();
  if (!reader)
    return Response.json({ error: "An enquiry is required." }, { status: 400 });
  let input: unknown;
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) {
        await reader.cancel();
        return Response.json(
          { error: "Enquiry is too large." },
          { status: 413 },
        );
      }
      chunks.push(value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return Response.json({ error: "Invalid enquiry." }, { status: 400 });
  }
  const result = validateEnquiry(input);
  if ("error" in result)
    return Response.json({ error: result.error }, { status: 400 });

  // Build the lead first: normalisation and duplicate detection happen whether
  // or not a store is configured, so the shape reaching the webhook is already
  // the shape the eventual database will hold. With no adapter registered this
  // records nothing and reports `persisted: false` — see lib/leads/repository.
  const source = pickSource(input);
  const outcome = await recordLead(result.data, {
    source,
    metadata: { origin },
  });

  const endpoint = process.env.ENQUIRY_WEBHOOK_URL;
  const secret = process.env.ENQUIRY_WEBHOOK_SECRET;
  if (!endpoint || !secret)
    return Response.json(
      { error: "Please contact us by email or phone." },
      { status: 503 },
    );
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      body: JSON.stringify({
        ...result.data,
        receivedAt: outcome.lead.createdAt,
        source: "sln-infra-website",
        // Lead context, so the receiving system can file it the way the
        // eventual dashboard will: which form, which project, and whether we
        // already hold an enquiry matching it.
        lead: {
          id: outcome.lead.id,
          formSource: outcome.lead.source,
          project: outcome.lead.project ?? null,
          duplicate: outcome.duplicate,
          persisted: outcome.persisted,
        },
      }),
      signal: AbortSignal.timeout(8000),
      redirect: "error",
    });
    if (!response.ok) throw new Error("Enquiry service unavailable");
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      {
        error:
          "Delivery could not be confirmed. Please try again or contact us directly.",
      },
      { status: 502 },
    );
  }
}

/**
 * Which form an enquiry came from. Supplied by the client as a plain hint and
 * checked against the known set — an unrecognised value is filed as a contact
 * enquiry rather than trusted into the record.
 */
function pickSource(input: unknown): LeadSource {
  const allowed: LeadSource[] = [
    "homepage",
    "project",
    "contact",
    "channel_partner",
    "career",
    "whatsapp",
    "popup",
  ];
  const value = (input as { source?: unknown })?.source;
  return allowed.includes(value as LeadSource)
    ? (value as LeadSource)
    : "contact";
}
