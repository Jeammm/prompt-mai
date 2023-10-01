import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import Comment from "@models/comment";

export const POST = async (req, { params }) => {
  const { userId, detail } = await req.json();

  try {
    await connectToDB();

    const comment = new Comment({
      commenter: userId,
      detail,
    });

    comment.save();

    await Prompt.findByIdAndUpdate(
      params.id,
      { $push: { comment: comment } },
      { new: true }
    );

    return new Response(JSON.stringify(comment), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to post comment", { status: 500 });
  }
};
