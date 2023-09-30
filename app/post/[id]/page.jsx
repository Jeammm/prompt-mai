"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

const Post = () => {
  const params = useParams();
  const postId = params.id;
  const { data: session } = useSession();

  const router = useRouter();

  const [copied, setCopied] = useState(null);
  const [post, setPost] = useState({
    creator: null,
    prompt: null,
    tag: null,
    liked: [],
    disliked: [],
    reaction: { liked: false, disliked: false },
  });

  const [liked, setLiked] = useState(post.reaction?.liked);
  const [disliked, setDisliked] = useState(post.reaction?.disliked);

  useEffect(() => {
    setLiked(post.reaction?.liked);
    setDisliked(post.reaction?.disliked);
  }, [post]);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/prompt/${postId}`, {
        headers: { userId: session?.user.id },
      });
      const data = await res.json();
      setPost(data);
    };
    fetchPost();
  }, [session]);

  const profileClickHandler = (e) => {
    e.stopPropagation();
    const cid = post?.creator?._id;
    if (cid) {
      router.push(`/profile/${cid}`);
    }
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(null), 3000);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!session?.user) {
      return alert("You need to Sign In before voting");
    }
    const tempLike = liked;
    const tempDislike = disliked;

    if (liked) {
      setLiked(false);
    } else {
      setLiked(true);
      if (disliked) {
        setDisliked(false);
      }
    }

    const res = await fetch(`/api/prompt/${post._id}/`, {
      method: "PUT",
      body: JSON.stringify({
        reaction: "like",
        userId: session?.user.id,
      }),
    });

    if (!res.ok) {
      setLiked(tempLike);
      setDisliked(tempDislike);
    }
  };

  const handleDislike = async (e) => {
    e.stopPropagation();
    if (!session?.user) {
      return alert("You need to Sign In before voting");
    }
    const tempLike = liked;
    const tempDislike = disliked;

    if (disliked) {
      setDisliked(false);
    } else {
      setDisliked(true);
      if (liked) {
        setLiked(false);
      }
    }

    const res = await fetch(`/api/prompt/${post._id}/`, {
      method: "PUT",
      body: JSON.stringify({
        reaction: "dislike",
        userId: session?.user.id,
      }),
    });

    if (!res.ok) {
      setLiked(tempLike);
      setDisliked(tempDislike);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${post._id}`);
  };

  return (
    <section className="prompt_post">
      <div className="w-full flex justify-between items-end ">
        <div
          className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
          onClick={profileClickHandler}
        >
          <Image
            src={post.creator?.image}
            alt="user"
            width={40}
            height={40}
            className="rounded-full object-containe"
          />
          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900">
              {post.creator?.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.creator?.email}
            </p>
          </div>
        </div>

        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            width={12}
            height={12}
            alt="copy"
          />
        </div>
      </div>
      <div className="post_text">
        <p className="font-satoshi w-full px-3">{post.prompt}</p>
        <div className="react_con">
          <div
            className="flex gap-1 hover:scale-[1.05] ease-in-out duration-100 cursor-pointer items-center"
            onClick={handleLike}
          >
            <p className="font-satoshi">
              {post.reaction.liked
                ? post.liked.length - 1 + liked
                : post.liked.length + liked}
            </p>
            <div>
              <Image
                src={
                  liked
                    ? "/assets/icons/vote/upvote_tick.svg"
                    : "/assets/icons/vote/upvote.svg"
                }
                width={23}
                height={23}
                alt="upvote"
              />
            </div>
          </div>
          <div
            className="flex gap-1 hover:scale-[1.05] ease-in-out duration-100 cursor-pointer items-center"
            onClick={handleDislike}
          >
            <p className="font-satoshi">
              {post.reaction.disliked
                ? post.disliked.length - 1 + disliked
                : post.disliked.length + disliked}
            </p>
            <div>
              <Image
                src={
                  disliked
                    ? "/assets/icons/vote/downvote_tick.svg"
                    : "/assets/icons/vote/downvote.svg"
                }
                width={23}
                height={23}
                alt="downvote"
              />
            </div>
          </div>

          <div
            className="hover:scale-[1.05] ease-in-out duration-100 cursor-pointer"
            onClick={handleShare}
          >
            <Image
              src="/assets/icons/share.svg"
              width={23}
              height={23}
              alt="share"
            />
          </div>
        </div>
      </div>
      {/* <div className="comment_con">
        <p>Comment</p>
        <form action="">
          <input type="text" className="search_input peer" />
        </form>
      </div> */}
    </section>
  );
};

export default Post;
