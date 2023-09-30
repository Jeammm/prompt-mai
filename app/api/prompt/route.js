import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, res) => {
  const header = await req.headers;
  const userId = header.get("userId");

  try {
    await connectToDB();
    const prompts = await Prompt.find({}).populate("creator");

    const promptsWithReaction = prompts.map((p) => {
      const likedUserIds = p.liked.map((user) => user._id.toString());
      const dislikedUserIds = p.disliked.map((user) => user._id.toString());

      return {
        ...p.toObject(),
        reaction: {
          liked: likedUserIds.includes(userId.toString()), // Assuming userId is a string
          disliked: dislikedUserIds.includes(userId.toString()), // Assuming userId is a string
        },
      };
    });

    return new Response(JSON.stringify(promptsWithReaction), { status: 201 });
  } catch (error) {
    return new Response("Failed to get prompts data", { status: 500 });
  }
};
