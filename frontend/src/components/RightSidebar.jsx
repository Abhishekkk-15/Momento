import store from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";

export default function RightSidebar() {
  const { user } = useSelector((store) => store.auth);

  return (
    <div
      className="
        hidden
        xl:flex
        flex-col
        w-72          /* fixed width on large screens */
        px-4
        pt-10
        sticky
        top-0
        h-screen
        overflow-y-scroll
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
      "
      aria-label="Right sidebar with user info and suggestions"
    >
      {/* User Info */}
      <div className="flex items-center gap-4 mb-8">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-16 h-16 rounded-full overflow-hidden">
            <AvatarImage
              className="w-16 h-16 object-cover rounded-full"
              src={user?.profilePicture}
              alt={`${user?.username}'s profile`}
            />
            <AvatarFallback className="w-16 h-16 bg-black text-white flex items-center justify-center text-lg font-semibold rounded-full">
              {user?.username?.slice(0, 2).toUpperCase() || "CN"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h2 className="font-bold text-lg">
            <Link to={`/profile/${user?._id}`} className="hover:underline">
              {user?.username || "Username"}
            </Link>
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {user?.bio || "Bio here..."}
          </p>
        </div>
      </div>

      {/* Suggested Users */}
      <SuggestedUser />
    </div>
  );
}
