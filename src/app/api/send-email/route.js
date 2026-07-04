import { sendDiscoveryInquiry } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();
    const company = body.company?.trim();
    const email = body.email?.trim();
    const phone = body.phone?.trim();
    const solutions = body.solutions?.trim();

    if (!name || !company || !email || !phone) {
      return Response.json(
        { error: "All required fields must be provided." },
        { status: 400 },
      );
    }

    if (!solutions) {
      return Response.json(
        { error: "At least one AI Solution must be selected." },
        { status: 400 },
      );
    }

    await sendDiscoveryInquiry({
      name,
      company,
      email,
      phone,
      solutions,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Discovery email failed:", {
      message: error.message,
    });

    return Response.json(
      { error: "Failed to send your message. Please try again later." },
      { status: 500 },
    );
  }
}
