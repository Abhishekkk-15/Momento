import store from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateFollowing } from "@/redux/authSlice";


export default function SuggestedUser() {
  // const { suggestedUsers, user: currentUser } = useSelector((store) => store.auth);
   const { suggestedUsers, user: currentUser } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const handleFollow = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/v1/user/followorunfollow/${userId}`,
        {
          method: "POST",
          credentials: "include"
        }
      );
      const data = await res.json();

      if (data.success) {
        // Toggle follow/unfollow UI
       dispatch(updateFollowing(userId));
      } else {
        alert(data.message || "Error following user.");
      }
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  return (
    <div className="my-10 border-l-2 border-t-2 pl-5 border-b-2 pb-5 pt-5">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers.map((user) => {
        // const isFollowing = followingStatus[user._id] || false;
        // const isFollowing = currentUser?.following?.includes(user._id);
        const isFollowing = user?.followers?.includes(currentUser?._id);

        return (
          <div
            key={user._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user?._id}`}>
                <Avatar className="">
                  <AvatarImage
                    className="h-8 w-8 rounded-full"
                    src={user?.profilePicture}
                    alt="user image"
                  />
                  <AvatarFallback className="bg-black text-white rounded-full h-8 w-8 flex items-center p-1">
                    {user?.username?.slice(0, 2).toUpperCase() || "CN"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="ml-3">
                <h1 className="font-bold text-sm">
                  <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {user?.bio || "Bio here..."}
                </span>
              </div>
            </div>
            {/* <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495D6]">Follow</span> */}
            <span
              className={`text-xs font-bold cursor-pointer ${
                isFollowing
                  ? "text-green-500"
                  : "text-[#3BADF8] hover:text-[#3495D6]"
              }`}
              onClick={() => handleFollow(user._id)}
            >
              {isFollowing ? "Following" : "Follow"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
