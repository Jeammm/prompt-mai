"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post, index) => (
        <PromptCard
          post={post}
          key={post._id}
          handleTagClick={() => handleTagClick(post)}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("search");
  const router = useRouter();
  const { data: session } = useSession();

  const [searchText, setSearchText] = useState(query || "");
  const [posts, setPosts] = useState([]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  const handleTagClick = (post) => {
    router.push(`/?search=${post.tag}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/?search=${searchText}`);
  };

  useEffect(() => {
    const fetchPost = async () => {
      let res;
      if (query) {
        res = await fetch(`/api/prompt/search/${query}`, {
          headers: {
            userId: session?.user.id,
          },
        });
      } else {
        res = await fetch(`/api/prompt/`, {
          headers: {
            userId: session?.user.id,
          },
        });
      }
      const data = await res.json();
      setPosts(data);
    };
    fetchPost();
    setSearchText(query || "");
  }, [searchParams, session]);

  return (
    <section className="feed">
      <form
        className="relative w-full flex-center"
        type="submit"
        onSubmit={submitHandler}
      >
        <input
          type="search"
          placeholder="Search for a tag or an idea..."
          value={searchText}
          onChange={handleSearchChange}
          // required
          className="search_input peer"
        />
      </form>

      <PromptCardList data={posts} handleTagClick={handleTagClick} />
    </section>
  );
};

export default Feed;
