import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import Proposal from "@/lib/models/proposal";
import { getRequestSession } from "@/lib/session";

function badRequest(message) {
  return Response.json({ error: message }, { status: 400 });
}

function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

function notFound() {
  return Response.json({ error: "Proposal not found" }, { status: 404 });
}

async function findOwnedProposal(id, userId) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return Proposal.findOne({ _id: id, userId });
}

export async function PATCH(request, context) {
  const session = await getRequestSession(request);
  if (!session?.user?.id) return unauthorized();

  const { id } = await context.params;
  await connectDB();

  const proposal = await findOwnedProposal(id, session.user.id);
  if (!proposal) return notFound();

  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");

  if (typeof body.originalInput === "string") {
    proposal.originalInput = body.originalInput.trim();
  }

  if (body.generated && typeof body.generated === "object") {
    if (typeof body.generated.scope === "string") {
      proposal.generated.scope = body.generated.scope.trim();
    }
    if (typeof body.generated.timeline === "string") {
      proposal.generated.timeline = body.generated.timeline.trim();
    }
    if (typeof body.generated.pricing === "string") {
      proposal.generated.pricing = body.generated.pricing.trim();
    }
    if (typeof body.generated.contract === "string") {
      proposal.generated.contract = body.generated.contract.trim();
    }
  }

  if (body.status === "draft" || body.status === "final") {
    proposal.status = body.status;
  }

  await proposal.save();

  return Response.json({ proposal });
}

export async function DELETE(request, context) {
  const session = await getRequestSession(request);
  if (!session?.user?.id) return unauthorized();

  const { id } = await context.params;
  await connectDB();

  const proposal = await findOwnedProposal(id, session.user.id);
  if (!proposal) return notFound();

  await Proposal.deleteOne({ _id: proposal._id });

  return Response.json({ ok: true });
}
