import { Heart, MessageCircle } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

function Explore() {
  const { posts } = useSelector((state) => state.post);

  return (
    <div>
      <div className="grid grid-cols-3 m-2 gap-2 mt-[5%] md:pr-[5%] md:pl-[15%] lg:pl-[25%] lg:pr-[8%]">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <div key={post?._id} className="relative group cursor-pointer">
              {/* <img
              key={post._id}
              className="rounded my-2 aspect-[4/4] object-cover border-l border-r border-gray-400"
              src={post.image}
              alt="post img"
            /> */}
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
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">No posts found</p>
        )}
      </div>
    </div>
  );
}

export default Explore;
