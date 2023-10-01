"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Comment from "@components/Comment";

const Post = () => {
  const params = useParams();
  const postId = params.id;
  const { data: session } = useSession();

  const router = useRouter();

  const [copied, setCopied] = useState(null);
  const [shared, setShared] = useState(null);

  const [post, setPost] = useState({
    creator: null,
    prompt: null,
    tag: null,
    liked: [],
    disliked: [],
    reaction: { liked: false, disliked: false },
    comment: [],
  });
  const [myComment, setMyComment] = useState("");
  const [comments, setComments] = useState([]);

  const [liked, setLiked] = useState(post.reaction?.liked);
  const [disliked, setDisliked] = useState(post.reaction?.disliked);

  useEffect(() => {
    setLiked(post.reaction?.liked);
    setDisliked(post.reaction?.disliked);
    setComments(post.comment.reverse());
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
    setShared(post._id);
    navigator.clipboard.writeText(
      `https://prompt-mai.vercel.app/post/${post._id}`
    );
    setTimeout(() => setShared(null), 3000);
  };

  const submitCommentHandler = async (e) => {
    e.preventDefault();
    if (!myComment) {
      return;
    }

    const now = new Date();

    const newComment = {
      commenter: {
        ...session?.user,
        username: session?.user.name.replace(" ", "").toLowerCase(),
      },
      detail: myComment,
      createdAt: now,
      _id: session?.user.id + now,
      myNewComment: true,
    };

    comments.unshift(newComment);
    const res = await fetch(`/api/prompt/${postId}/comment`, {
      method: "POST",
      body: JSON.stringify({
        userId: session.user.id,
        detail: myComment,
      }),
    });

    if (res.ok) {
      setMyComment("");
    } else {
      comments.slice(1);
      alert("error posting your comment");
    }
  };

  return (
    <section className="w-full">
      <div className="prompt_post">
        <div className="w-full flex justify-between items-end ">
          <div
            className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
            onClick={profileClickHandler}
          >
            <Image
              src={
                post.creator?.image
                  ? post.creator?.image
                  : "/assets/images/logo.svg"
              }
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
                src={
                  shared ? "/assets/icons/tick.svg" : "/assets/icons/share.svg"
                }
                width={23}
                height={23}
                alt="share"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="prompt_post my-3">
        <p>Comments</p>
        <form onSubmit={submitCommentHandler}>
          <input
            type="text"
            className="search_input peer"
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
          />
        </form>
        {comments.map((c) => (
          <Comment data={c} key={c._id} />
        ))}
      </div>
    </section>
  );
};

export default Post;
