"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [userDetail, setUserDetail] = useState(null);

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/users/${params.id}/post`);
      const data = await res.json();
      setPosts(data);
    };
    fetchPost();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/users/${params.id}/profile`);
      const data = await res.json();
      setUserDetail(data);
    };
    fetchUser();
  }, []);

  return (
    <Profile
      name={userDetail?.username}
      desc={`welcome to ${userDetail?.username} profile page`}
      data={posts}
    />
  );
};

export default MyProfile;
