// import React, { useState } from "react";

// const InstaPost = ({
//   user,
//   postImage,
//   timestamp,
//   initialLikes,
//   caption,
//   comments,
// }) => {
//   const [likes, setLikes] = useState(initialLikes);
//   const [liked, setLiked] = useState(false);
//   const [showComments, setShowComments] = useState(false);

//   const toggleLike = () => {
//     if (liked) {
//       setLikes((prev) => prev - 1);
//     } else {
//       setLikes((prev) => prev + 1);
//     }
//     setLiked(!liked);
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white border border-gray-300 rounded-md shadow-md my-6">
//       {/* Post Header */}
//       <div className="flex items-center px-4 py-3">
//         <img
//           src={user.avatar}
//           alt={`${user.username} avatar`}
//           className="w-10 h-10 rounded-full object-cover mr-3"
//         />
//         <div>
//           <p className="font-semibold text-gray-900">{user.username}</p>
//           <p className="text-xs text-gray-500">{timestamp}</p>
//         </div>
//       </div>

//       {/* Post Image */}
//       <img src={postImage} alt="Post" className="w-full object-cover" />

//       {/* Post Actions */}
//       <div className="px-4 py-3">
//         <div className="flex items-center mb-2">
//           <button onClick={toggleLike} aria-label="Like Button" className="focus:outline-none mr-4">
//             {liked ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="red"
//                 viewBox="0 0 24 24"
//                 stroke="red"
//                 className="w-6 h-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4.318 6.318a4.5 4.5 0 010 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 className="w-6 h-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4.318 6.318a4.5 4.5 0 010 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
//                 />
//               </svg>
//             )}
//           </button>

//           <button className="focus:outline-none mr-4" aria-label="Comment Button">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               className="w-6 h-6"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M7 8h10M7 12h4m-4 4h6m2 0h2a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h2"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Likes count */}
//         <p className="font-semibold text-gray-900 mb-1">{likes} likes</p>

//         {/* Caption */}
//         <p className="mb-2">
//           <span className="font-semibold mr-2">{user.username}</span>
//           {caption}
//         </p>

//         {/* Comments toggle */}
//         {comments.length > 0 && (
//           <button
//             onClick={() => setShowComments((prev) => !prev)}
//             className="text-gray-500 text-sm mb-2 focus:outline-none"
//           >
//             {showComments ? "Hide comments" : `View all ${comments.length} comments`}
//           </button>
//         )}

//         {/* Comments list */}
//         {showComments &&
//           comments.map((comment, idx) => (
//             <p key={idx} className="text-gray-700 text-sm mb-1">
//               <span className="font-semibold mr-2">{comment.user}</span>
//               {comment.text}
//             </p>
//           ))}
//       </div>
//     </div>
//   );
// };

// export default InstaPost;
