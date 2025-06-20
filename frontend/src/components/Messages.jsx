import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/Hooks/useGetAllMessage";
import useGetRTM from "@/Hooks/useGetRTM";

function Messages({ selectedUser }) {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="overflow-y-auto flex-2 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center">
          <Link to={`/profile/${selectedUser?._id}`}>
          <Avatar className=" flex items-center justify-center h-20 w-20">
            <AvatarImage
              className="h-20 w-20 rounded-full"
              src={selectedUser?.profilePicture}
              alt="profile"
            />
            <AvatarFallback className="bg-black text-white text-2xl rounded-full h-20 w-20 flex items-center justify-center">
              {selectedUser?.username?.slice(0, 2).toUpperCase() || "CN"}
            </AvatarFallback>
          </Avatar>
          </Link>
          <span className="font-semibold">{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-6">
        {messages && messages.length > 0 ? (
          messages.map((msg) => {
            const isOwnMessage = msg.senderId === user?._id;
            return (
              <div
                key={msg._id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${
                    isOwnMessage
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <p>{msg.message}</p>
                  <span className="text-xs opacity-70 block mt-1 text-right">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400">No messages yet.</p>
        )}
      </div>
    </div>
  );
}

export default Messages;
