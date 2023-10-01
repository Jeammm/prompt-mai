import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import Comment from "@models/comment";

export const GET = async (req, { params }) => {
  const header = await req.headers;
  const userId = header.get("userId");

  try {
    await connectToDB();
    const prompt = await Prompt.findById(params.id)
      .populate("creator")
      .populate({
        path: "comment",
        populate: {
          path: "commenter",
        },
      });

    if (!prompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    const likedUserIds = prompt.liked.map((user) => user._id.toString());
    const dislikedUserIds = prompt.disliked.map((user) => user._id.toString());

    const promptWithReaction = {
      ...prompt.toObject(),
      reaction: {
        liked: likedUserIds.includes(userId),
        disliked: dislikedUserIds.includes(userId),
      },
    };

    return new Response(JSON.stringify(promptWithReaction), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to get prompts data", { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  const { prompt, tag } = await req.json();

  try {
    await connectToDB();
    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }
    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return new Response(JSON.stringify(prompt), { status: 201 });
  } catch (error) {
    return new Response("Failed to edit prompts", { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  try {
    await connectToDB();
    await Prompt.findByIdAndRemove(params.id);

    return new Response("Prompt deleted successfully", { status: 201 });
  } catch (error) {
    return new Response("Failed to delete prompt", { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  const { reaction, userId } = await req.json();

  if (!userId) {
    return new Response("You need to Sign In before voting", { status: 401 });
  }

  try {
    await connectToDB();

    let existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    if (reaction === "like") {
      const isAlreadyLiked = existingPrompt.liked.find((u) => u == userId);

      if (isAlreadyLiked) {
        existingPrompt = await Prompt.findByIdAndUpdate(
          params.id,
          { $pull: { liked: userId } },
          { new: true }
        );
      } else {
        existingPrompt = await Prompt.findByIdAndUpdate(
          params.id,
          { $push: { liked: userId } },
          { new: true }
        );

        await Prompt.findByIdAndUpdate(
          params.id,
          { $pull: { disliked: userId } },
          { new: true }
        );
      }
    } else if (reaction === "dislike") {
      const isAlreadyDisliked = existingPrompt.disliked.find(
        (u) => u == userId
      );

      if (isAlreadyDisliked) {
        existingPrompt = await Prompt.findByIdAndUpdate(
          params.id,
          { $pull: { disliked: userId } },
          { new: true }
        );
      } else {
        existingPrompt = await Prompt.findByIdAndUpdate(
          params.id,
          { $push: { disliked: userId } },
          { new: true }
        );

        await Prompt.findByIdAndUpdate(
          params.id,
          { $pull: { liked: userId } },
          { new: true }
        );
      }
    }
    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 201 });
  } catch (error) {
    return new Response("Failed to edit prompts", { status: 500 });
  }
};
