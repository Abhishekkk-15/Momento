import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import {
  Bookmark,
  BookmarkCheckIcon,
  MessageCircle,
  MoreHorizontal,
  Send,
  Play,
  Pause,
} from "lucide-react";
import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import CommentDailog from "./CommentDailog";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";
import axios from "axios";
import { Badge } from "./ui/badge";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { setUserProfile, updateFollowing } from "@/redux/authSlice";
import { useMemo } from "react";

export default function Post({ post }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user, userProfile } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  // const isBookmarked = user?.bookmarks?.includes(post._id);

  // const isBookmarked =
  // Array.isArray(user?.bookmarks) && user.bookmarks.includes(post._id);
  const [bookmarked, setBookmarked] = useState(
    Array.isArray(user?.bookmarks) && user.bookmarks.includes(post._id)
  );

  const dispatch = useDispatch();
  // const isFollowing = user?.following?.includes(userProfile?._id);
  // const isFollowing = user?.following?.includes(post.author._id);
  const isFollowing = useMemo(() => {
    return user?.following?.includes(post.author._id);
  }, [user?.following, post.author._id]);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const changeEventHandeler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : "");
  };

  const likeAndDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8080/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comment: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      console.log("BOOKMARK RESPONSE:", res.data);

      if (res.data.success) {
        dispatch(setAuthUser({ ...user, bookmarks: res.data.bookmarks }));
        setBookmarked(!bookmarked);
        console.log("User updated with bookmarks:", res.data.bookmarks);
        toast.success(res.data.message);
        console.log("Bookmark response:", res.data.bookmarks);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const isVideo = () => {
    if (post.mediaType) return post.mediaType === "video";
    const file = post.video || post.image;
    return /\.(mp4|webm|ogg)$/i.test(file);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const handleFollow = async () => {
  try {
    const res = await fetch(
      `http://localhost:8080/api/v1/user/followorunfollow/${post.author._id}`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const data = await res.json();

    if (data.success) {
      dispatch(updateFollowing(post.author._id));

      // Optionally update author followers inside post if you're storing post in Redux
      const updatedPosts = posts.map((p) =>
        p._id === post._id
          ? {
              ...p,
              author: {
                ...p.author,
                followers: isFollowing
                  ? p.author.followers.filter((id) => id !== user._id)
                  : [...p.author.followers, user._id],
              },
            }
          : p
      );
      dispatch(setPosts(updatedPosts));
    } else {
      toast.error(data.message || "Error updating follow status.");
    }
  } catch (error) {
    console.error("Follow/Unfollow error:", error);
  }
};


  return (
    <div className="my-5 w-full max-w-sm mx-auto">
      {/* Top User Section */}
      <div className="flex items-center justify-between border-t-2 border-l-2 border-r-2 rounded-md p-2">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${post.author?._id}`}>
            <Avatar>
              <AvatarImage
                className="w-10 h-10 rounded-full ml-2"
                src={post.author?.profilePicture}
                alt="profile"
              />
              <AvatarFallback className="bg-black text-white rounded-full h-8 w-8 flex items-center p-1">
                {post.author?.username?.slice(0, 2).toUpperCase() || "CN"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Link to={`/profile/${post.author?._id}`}>
            <div className="flex items-center gap-3">
              <h1 className="font-bold">{post.author?.username}</h1>
              {user?._id === post.author._id && (
                <Badge variant="secondary">Author</Badge>
              )}
            </div>
          </Link>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="z-[1000] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg p-4 w-64 flex flex-col items-center">
            {post?.author?._id !== user?._id && (
              <Button
                onClick={handleFollow}
                variant={isFollowing ? "secondary" : "default"}
                className={`h-8 ${
                  isFollowing ? "" : "bg-[#0095F6] hover:bg-[#3192d2]"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to favorites
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deleteHandler}
                variant="ghost"
                className="cursor-pointer  w-fit text-[#ED4956] font-bold"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Media Section */}
      <div className="my-2">
        {isVideo() ? (
          <div className="relative rounded aspect-[4/5] w-full border-l border-r border-gray-400 overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={post.video || post.image} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button
              onClick={togglePlay}
              className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 p-2 rounded-full text-white transition"
            >
              {isPlaying ? <Pause size={22} /> : <Play size={22} />}
            </button>
          </div>
        ) : (
          <img
            className="rounded aspect-[4/5] w-full object-cover border-l border-r border-gray-400"
            src={post.image}
            alt="post"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              size={"22px"}
              className="cursor-pointer text-red-600"
              onClick={likeAndDislikeHandler}
            />
          ) : (
            <CiHeart
              size={"24px"}
              onClick={likeAndDislikeHandler}
              className="cursor-pointer hover:text-gray-600"
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send size={"22px"} className="cursor-pointer hover:text-gray-600" />
        </div>
        {bookmarked ? (
          <BookmarkCheckIcon
            onClick={bookmarkHandler}
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
        ) : (
          <Bookmark
            onClick={bookmarkHandler}
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
        )}
      </div>

      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>

      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer text-sm text-gray-400"
        >
          View all {comment.length} comments
        </span>
      )}
      <CommentDailog open={open} setOpen={setOpen} />

      {/* Comment Input */}
      <div className="flex items-center justify-between border-b-2 border-gray-400">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandeler}
          className="outline-none text-sm w-full mb-2"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}
