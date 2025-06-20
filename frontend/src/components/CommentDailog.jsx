import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

export default function CommentDailog({ open, setOpen }) {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendmessageHandler = async () => {
    try {
      const res = await axios.post(
        `https://momento-7gr6.onrender.com/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },

          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comment: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg p-4 w-150 flex flex-col items-center h-"
      >
        <div className="flex felx-1">
          <div className="w-1/2">
            {selectedPost?.video &&
            /\.(mp4|webm|ogg)$/i.test(selectedPost.video) ? (
              <video
                src={selectedPost.video}
                className="aspect-[4/5] object-cover"
                autoPlay
                muted
                loop
                controls
              />
            ) : (
              <img
                src={selectedPost?.image}
                alt="post"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="w-1/2 flex flex-col justify-between ml-1">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage
                      src={selectedPost?.author?.profilePicture}
                      alt="post image"
                      className="rounded-full h-10 w-10"
                    />
                    <AvatarFallback className="bg-black text-white rounded-full h-10 w-10 flex items-center p-2">
                      {selectedPost?.author?.username
                        ?.slice(0, 2)
                        .toUpperCase() || "CN"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex  gap-3 items-center">
                  <Link className="font-semibold text-xm">
                    {selectedPost?.author?.username}
                  </Link>
                  {/* <span className="text-gray-600 text-sm">Bio here...</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg p-4 w-64 flex flex-col gap-2 items-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold text-center">
                    Report
                  </div>
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold text-center">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full text-center">
                    Add to favorites
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-scroll max-h-96 p-4">
              {comment.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full outline-none  border-gray-300 p-2 rounded text-sm"
                  onChange={changeEventHandler}
                  value={text}
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendmessageHandler}
                  variant="outline"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
