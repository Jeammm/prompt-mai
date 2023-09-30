import { Schema, model, models } from "mongoose";

const CommentSchema = new Schema({
  commenter: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User detail is required"],
  },
  detail: {
    type: String,
    required: [true, "Comment text is required!"],
  },
});

const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;
