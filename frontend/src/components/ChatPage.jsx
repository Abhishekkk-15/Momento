import { setSelectedUser } from "@/redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages, addMessage } from "@/redux/chatSlice";
import { Link } from "react-router-dom";

function ChatPage() {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const dispatch = useDispatch();
  const { onlineUsers, messages } = useSelector((store) => store.chat);

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `https://momento-7gr6.onrender.com/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(addMessage(res.data.newMessage));
        // setTextMessage("");
      }
      setTextMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex h-screen ">
      <div className=" md:w-1/3 md:pl-[11%]  lg:pl-[17%] pl-[2%] py-6">
        <h1 className="text-2xl font-semibold mb-6 text-black">
          {user?.username}
        </h1>
        <hr className="border-gray-700 mb-4" />
        <div className="overflow-y-auto h-[80vh] custom-scrollbar">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex items-center gap-3 p-3 hover:bg-gray-300 rounded cursor-pointer"
              >
                <Link to={`/profile/${selectedUser?._id}`}>
                  <Avatar>
                    <AvatarImage
                      className="w-8 h-8 rounded-full "
                      src={suggestedUser?.profilePicture}
                    />
                    <AvatarFallback className="bg-black text-white rounded-full h-8 w-8 flex items-center p-1 ">
                      {suggestedUser?.username?.slice(0, 2).toUpperCase() ||
                        "CN"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <p className="mr-1">{suggestedUser?.username}</p>
                  <p
                    className={`text-sm font-semibold ${
                      isOnline ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col border-l-2">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-700">
              <Link to={`/profile/${selectedUser?._id}`}>
                <Avatar className=" flex items-center w-10 h-10">
                  <AvatarImage
                    className=" w-8 h-8 rounded-full"
                    src={selectedUser?.profilePicture}
                  />
                  <AvatarFallback className="bg-black text-white rounded-full h-10 w-10 flex items-center p-2">
                    {selectedUser?.username?.slice(0, 2).toUpperCase() || "CN"}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Link to={`/profile/${selectedUser?._id}`}>
                <div>
                  <p className="font-semibold">{selectedUser?.username}</p>
                </div>
              </Link>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
              <Messages selectedUser={selectedUser} />
            </div>
            {/* Input */}
            <div className="flex items-center gap-3 p-4 border-t border-gray-700 ">
              <Input
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                type="text"
                placeholder="Message..."
                className="flex-1 bg-gray-200 border border-gray-600 mb-8"
              />
              <Button
                onClick={() => sendMessageHandler(selectedUser?._id)}
                className="bg-blue-600 text-white mb-8"
              >
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1">
            <MessageCircleCode className="w-24 h-24 text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold">Your messages</h2>
            <p className="text-gray-400">Send a message to start a chat.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
