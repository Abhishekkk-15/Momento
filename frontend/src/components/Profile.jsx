// import useGetUserProfile from "@/Hooks/UseGetUserProfile";
import store from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateFollowing } from "@/redux/authSlice";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import Bottomsidebar from "./Bottomsidebar";
import { setUserProfile } from "@/redux/authSlice";
import useGetUserProfile from "@/Hooks/useGetUserProfile";

export default function Profile() {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile, user, selectedUser } = useSelector((store) => store.auth);

  const isLoggedinUserProfile = user?._id === userProfile?._id;
  // const isFollowing = user?.following?.includes(userProfile?._id);
  const isFollowing = userProfile?.followers?.includes(user?._id);

  const dispatch = useDispatch();

  const handleFollow = async () => {
    try {
      const res = await fetch(
        `https://momento-7gr6.onrender.com/api/v1/user/followorunfollow/${userProfile?._id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        // ✅ 1. Update current user's following in Redux
        dispatch(updateFollowing(userProfile._id));

        // ✅ 2. Re-fetch the userProfile to update follower/following count
        const profileRes = await fetch(
          `https://momento-7gr6.onrender.com/api/v1/user/${userId}/profile`,
          {
            credentials: "include",
          }
        );
        const profileData = await profileRes.json();

        if (profileData.success) {
          dispatch(setUserProfile(profileData.user)); // ✅ 3. Update userProfile in Redux
        }
      } else {
        alert(data.message || "Error updating follow status.");
      }
    } catch (error) {
      console.error("Follow/Unfollow error:", error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts"
      ? userProfile?.posts ?? []
      : activeTab === "saved"
      ? userProfile?.bookmarks ?? []
      : [];

  return (
    <div className="flex max-w-5xl justify-center mx-auto p-5 md:pl-15 lg:pl-30">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-50 w-50">
              <AvatarImage
                className=" w-50 h-50 rounded-full"
                src={userProfile?.profilePicture}
                alt="profilr picture"
              />
              <AvatarFallback className="bg-black text-white rounded-full h-25 w-25 mt-15 md:h-40 md:w-40 md:mt-10 lg:w-50 lg:h-50 lg:mt-0 flex items-center justify-center lg:text-5xl">
                {userProfile?.username?.slice(0, 2).toUpperCase() || "CN"}
              </AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="font-bold underline">
                  {userProfile?.username}
                </span>
                {isLoggedinUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View Archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleFollow}
                      variant={isFollowing ? "secondary" : "default"}
                      className={`h-8 ${
                        isFollowing ? "" : "bg-[#0095F6] hover:bg-[#3192d2]"
                      }`}
                    >
                      {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                    {isFollowing && (
                      <Link to={`/chat`}>
                        <Button variant="secondary" className="h-8">
                          Message
                        </Button>
                      </Link>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>{" "}
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers.length}{" "}
                  </span>{" "}
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length}{" "}
                  </span>{" "}
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
                <span>DM for Collaboration</span>
              </div>
            </div>
          </section>
        </div>
        <div className=" border-t border-t-gray-200">
          <div className="pl-4 grid grid-cols-3">
            <span
              className={`hover:underline py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`hover:underline py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span
              className={`hover:underline py-3 cursor-pointer ${
                activeTab === "reels" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("reels")}
            >
              REELS
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  {post?.video && /\.(mp4|webm|ogg)$/i.test(post.video) ? (
                    <video
                      src={post.video}
                      className="aspect-[4/5] object-cover"
                      autoPlay
                      muted
                      loop
                      controls
                    />
                  ) : (
                    <img
                      src={post.image || post.video}
                      alt="post"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Bottomsidebar className="fixed bottom-0 w-full bg-white border-t border-gray-300 z-10 flex justify-around items-center py-2  md:hidden" />
    </div>
  );
}
