import React from 'react';
import Post from './Post';
import { useSelector } from 'react-redux';

export default function Posts() {
  const { posts } = useSelector(state => state.post);

  return (
    <div
      className="
        px-4               
        py-6               
        max-w-3xl          
        mx-auto            
        w-full             
        sm:px-6            
        md:px-8            
        lg:px-10           
      "
      aria-label="Posts list"
    >
      {
        posts && posts.length > 0
          ? posts.map(post => <Post key={post._id} post={post} />)
          : <p className="text-center text-gray-500">No posts found</p>
      }
    </div>
  );
}
