"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Form from "@components/Form";

const CreatePrompt = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
  });

  const createPrompt = async (e) => {
    e.preventDefault();

    if (session?.user) {
      setSubmitting(true);
      try {
        const res = await fetch("/api/prompt/new", {
          method: "POST",
          body: JSON.stringify({
            prompt: post.prompt,
            userId: session?.user.id,
            tag: post.tag,
          }),
        });
        if (res.ok) {
          router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {session?.user ? (
        <Form
          type="Create"
          post={post}
          setPost={setPost}
          submitting={submitting}
          handleSubmit={createPrompt}
        />
      ) : (
        <div className="w-full">
          <h1 className="head_text text-left">
            <span className="blue_gradient">Please Sign In</span>
          </h1>
          <p className="desc text-left max-w-md">
            You need to be signed in before you can post some prompts. 🙏🏻
          </p>
        </div>
      )}
    </>
  );
};

export default CreatePrompt;
