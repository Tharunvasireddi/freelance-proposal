import { connectDB } from "@/lib/db";
import Proposal from "@/lib/models/proposal";
import { generateProposalSections } from "@/lib/openai";
import { getRequestSession } from "@/lib/session";

function badRequest(message) {
  return Response.json({ error: message }, { status: 400 });
}

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request) {
  const session = await getRequestSession(request);
  if (!session?.user?.id) return unauthorized();

  await connectDB();

  const proposals = await Proposal.find({ userId: session.user.id })
    .sort({ updatedAt: -1 })
    .limit(100)
    .lean();

  return Response.json({ proposals });
}

export async function POST(request) {
  const session = await getRequestSession(request);
  if (!session?.user?.id) return unauthorized();

  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const mode = body.mode === "manual" ? "manual" : "ai";
  const originalInput = (body.originalInput || "").trim();
  const status = body.status === "final" ? "final" : "draft";

  if (!originalInput) {
    return badRequest("originalInput is required");
  }

  await connectDB();

  let generated;

  if (mode === "manual") {
    generated = {
      scope: (body.generated?.scope || "").trim(),
      timeline: (body.generated?.timeline || "").trim(),
      pricing: (body.generated?.pricing || "").trim(),
      contract: (body.generated?.contract || "").trim(),
    };

    if (
      !generated.scope ||
      !generated.timeline ||
      !generated.pricing ||
      !generated.contract
    ) {
      return badRequest("All generated fields are required for manual mode");
    }
  } else {
    try {
      generated = await generateProposalSections(originalInput);
    } catch (error) {
      return Response.json(
        { error: error?.message || "Failed to generate proposal" },
        { status: 502 },
      );
    }
  }

  const proposal = await Proposal.create({
    userId: session.user.id,
    originalInput,
    generated,
    status,
  });

  return Response.json({ proposal }, { status: 201 });
}
