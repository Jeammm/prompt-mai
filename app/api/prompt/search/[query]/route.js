import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, { params }) => {
  const queryObject = [];
  const query = params.query.split(" ");

  query.forEach((q) =>
    queryObject.push(
      // { creator: { $regex: q, $options: "i" } },
      { prompt: { $regex: q, $options: "i" } },
      { tag: { $regex: q, $options: "i" } }
    )
  );

  try {
    await connectToDB();
    const prompts = await Prompt.find({
      $or: queryObject,
    }).populate("creator");

    return new Response(JSON.stringify(prompts), { status: 201 });
  } catch (error) {
    return new Response("Failed to get prompts data", { status: 500 });
  }
};
