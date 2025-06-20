// import React, { useRef, useState } from "react";
// import { useDispatch } from "react-redux";
// import { uploadStory } from "../redux/storySlice";

// const AddStory = () => {
//   const dispatch = useDispatch();
//   const fileInputRef = useRef(null);
//   const [preview, setPreview] = useState(null);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setPreview(URL.createObjectURL(file));
//     dispatch(uploadStory(file));
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <button
//         onClick={() => fileInputRef.current.click()}
//         className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-2xl"
//       >
//         +
//       </button>
//       <input
//         type="file"
//         ref={fileInputRef}
//         accept="image/*,video/*"
//         onChange={handleFileChange}
//         className="hidden"
//       />
//       {preview && (
//         <p className="text-xs text-center mt-1 text-gray-500">Uploading...</p>
//       )}
//     </div>
//   );
// };

// export default AddStory;

import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { uploadStory } from "../redux/storySlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const AddStory = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stories } = useSelector((state) => state.story);
  const safeStories = Array.isArray(stories) ? stories : [];

  const userStory = user
    ? safeStories.find((story) => story?.user?._id === user._id)
    : null;

  const firstStoryMedia = userStory?.media?.[0];

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    dispatch(uploadStory(file));
  };

  const handleClick = () => {
    if (userStory) {
      // open story viewer logic (to be passed as prop from parent)

      console.log("Open viewer for your story");
    } else {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={handleClick}
        className="w-20 h-20 rounded-full border-2 border-pink-500 flex items-center justify-center overflow-hidden cursor-pointer"
      >
        {firstStoryMedia ? (
          <img
            src={firstStoryMedia.url}
            alt="Your Story"
            className="w-full h-full object-cover"
          />
        ) : (
          <div>
            <Avatar className="h-50 w-50">
              <AvatarImage
                className="w-full h-full object-cover"
                src={user?.profilePicture}
                alt="profilr picture"
              />
              <AvatarFallback className="bg-black text-white rounded-full h-25 w-25 mt-15 md:h-40 md:w-40 md:mt-10 lg:w-50 lg:h-50 lg:mt-0 flex items-center justify-center lg:text-5xl">
                {user?.username?.slice(0, 2).toUpperCase() || "CN"}
              </AvatarFallback>
            </Avatar>

          </div>
        )}
      </div>
      <h1 className="pt-2 text-pink-500">{user?.username}</h1>
      {/* <label
        htmlFor="add-story-file"
        className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center border-2 border-white cursor-pointer"
        title="Add Story"
      >
        +
      </label> */}
      
      <p className="text-xs mt-1 text-center text-blue-500">Your Story</p>

      <input
        type="file"
        id="add-story-file"
        ref={fileInputRef}
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {preview && (
        <p className="text-xs text-center mt-1 text-gray-500">Uploading...</p>
      )}
    </div>
  );
};

export default AddStory;
