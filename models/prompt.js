import { Schema, model, models } from "mongoose";

const PromptSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User detail is required"],
  },
  prompt: {
    type: String,
    required: [true, "Prompt is required."],
  },
  tag: {
    type: String,
  },
  liked: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  disliked: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comment: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const Prompt = models.Prompt || model("Prompt", PromptSchema);

export default Prompt;
