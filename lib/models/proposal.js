import mongoose from "mongoose";

const { Schema } = mongoose;

const proposalSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "userId is required"],
      index: true,
      immutable: true,
      trim: true,
    },
    originalInput: {
      type: String,
      required: [true, "Client requirement text is required"],
      trim: true,
      minlength: [1, "Client requirement text cannot be empty"],
      maxlength: [50000, "Client requirement text is too long"],
    },
    generated: {
      scope: {
        type: String,
        required: [true, "Generated scope is required"],
        trim: true,
      },
      timeline: {
        type: String,
        required: [true, "Generated timeline is required"],
        trim: true,
      },
      pricing: {
        type: String,
        required: [true, "Generated pricing is required"],
        trim: true,
      },
      contract: {
        type: String,
        required: [true, "Generated contract is required"],
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ["draft", "final"],
      required: true,
      default: "draft",
      index: true,
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
  },
);

proposalSchema.index({ userId: 1, createdAt: -1 });
proposalSchema.index({ userId: 1, status: 1, updatedAt: -1 });

proposalSchema.index(
  {
    originalInput: "text",
    "generated.scope": "text",
    "generated.contract": "text",
  },
  {
    weights: {
      originalInput: 10,
      "generated.scope": 6,
      "generated.contract": 4,
    },
    name: "proposal_text_search_idx",
  },
);

const Proposal =
  mongoose.models.Proposal || mongoose.model("Proposal", proposalSchema);

export default Proposal;
