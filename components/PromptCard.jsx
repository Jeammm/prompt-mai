"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const PromptCard = ({ post, handleTagClick, handleEdit, handleDelete }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState(null);
  const [shared, setShared] = useState(null);

  const [liked, setLiked] = useState(post.reaction.liked);
  const [disliked, setDisliked] = useState(post.reaction.disliked);

  useEffect(() => {
    setLiked(post.reaction.liked);
    setDisliked(post.reaction.disliked);
  }, [post]);

  const handleCopy = (e) => {
    e.stopPropagation();
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(null), 3000);
  };

  const profileClickHandler = (e) => {
    e.stopPropagation();
    const cid = post?.creator?._id;
    if (cid) {
      router.push(`/profile/${cid}`);
    }
  };

  const cardClickHandler = () => {
    router.push(`/post/${post._id}`);
  };

  const handleTagPress = (e) => {
    e.stopPropagation();
    if (handleTagClick) {
      handleTagClick(post.tag);
    }
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
  const editPress = (e) => {
    e.stopPropagation();
    handleEdit();
  };

  const deletePress = (e) => {
    e.stopPropagation();
    handleDelete();
  };

  return (
    <div className="prompt_card cursor-pointer" onClick={cardClickHandler}>
      <div className="flex justify-between items-start gap-5">
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

      <p className="my-4 font-satoshi text-sm text-grey-700">{post.prompt}</p>
      <p
        className="font-inter text-sm blue_gradient cursor-pointer w-fit"
        onClick={(e) => handleTagPress(e)}
      >
        #{post.tag}
      </p>

      <div className="flex flex-end gap-3 mt-3">
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

        <div className="flex gap-1 hover:scale-[1.05] ease-in-out duration-100 cursor-pointer items-center">
          <p className="font-satoshi">{post.comment.length}</p>
          <div>
            <Image
              src={"/assets/icons/comment.svg"}
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
              shared === post._id
                ? "/assets/icons/tick.svg"
                : "/assets/icons/share.svg"
            }
            width={23}
            height={23}
            alt="share"
          />
        </div>
      </div>

      {session?.user.id === post.creator?._id && pathName === "/profile" && (
        <div className="mt-3 flex-center gap-4 border-t border-gray-100 pt-3">
          <p
            onClick={editPress}
            className="font-inter text-sm green_gradient cursor-pointer"
          >
            Edit
          </p>
          <p
            onClick={deletePress}
            className="font-inter text-sm orange_gradient cursor-pointer"
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
