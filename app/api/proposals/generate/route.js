import { generateProposalSections } from "@/lib/openai";
import { getRequestSession } from "@/lib/session";

function badRequest(message) {
  return Response.json({ error: message }, { status: 400 });
}

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request) {
  const session = await getRequestSession(request);
  if (!session?.user?.id) return unauthorized();

  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  const originalInput = (body.originalInput || "").trim();

  if (!originalInput) {
    return badRequest("originalInput is required");
  }

  try {
    const generated = await generateProposalSections(originalInput);
    return Response.json({ generated });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Failed to generate proposal" },
      { status: 502 },
    );
  }
}
