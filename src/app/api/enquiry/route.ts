import { validateEnquiry } from "@/lib/enquiry";

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
        receivedAt: new Date().toISOString(),
        source: "sln-infra-website",
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
