"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [userDetail, setUserDetail] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/users/${params.id}/post`, {
        headers: { userId: session?.user.id },
      });
      const data = await res.json();
      setPosts(data);
    };
    const fetchUser = async () => {
      const res = await fetch(`/api/users/${params.id}/profile`);
      const data = await res.json();
      setUserDetail(data);
    };
    fetchPost();
    fetchUser();
  }, [session]);

  return (
    <Profile
      name={userDetail?.username}
      desc={`welcome to ${userDetail?.username} profile page`}
      data={posts}
    />
  );
};

export default MyProfile;
