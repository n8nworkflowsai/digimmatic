import { sendDiscoveryInquiry } from "@/lib/email";
import { enforceRateLimit } from "@/lib/rate-limit";
import { SOLUTION_LABELS } from "@/lib/constants";
import { getClientIp, validateDiscoveryPayload } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const validation = validateDiscoveryPayload(body, SOLUTION_LABELS);

    if (!validation.ok) {
      return Response.json({ error: validation.error }, { status: validation.status });
    }

    if (validation.honeypot) {
      return Response.json({ success: true });
    }

    const clientIp = getClientIp(request);
    const rateLimit = await enforceRateLimit(`send-email:${clientIp}`);

    if (!rateLimit.allowed) {
      return Response.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfter ?? 60) },
        },
      );
    }

    await sendDiscoveryInquiry(validation.payload);

    return Response.json({ success: true });
  } catch (error) {
    console.error("[api/send-email] Discovery email failed:", {
      message: error.message,
      name: error.name,
    });

    return Response.json(
      { error: "Failed to send your message. Please try again later." },
      { status: 500 },
    );
  }
}
