// export default StoryViewer;
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { deleteStory } from "../redux/storySlice";

const isVideo = (url) => {
  const ext = url.split(".").pop().toLowerCase();
  return ["mp4", "webm", "ogg"].includes(ext);
};

const StoryViewer = ({
  stories,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  authUserId,
}) => {
  const current = stories[currentIndex];
  const isOwnStory = current?.user?._id === authUserId;
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [autoSlideTimer, setAutoSlideTimer] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear any existing timers when index changes
    if (autoSlideTimer) clearTimeout(autoSlideTimer);

    if (!current) return;

    if (!isVideo(current.imageUrl)) {
      // Auto-slide for image
      const timer = setTimeout(onNext, 3000);
      setAutoSlideTimer(timer);
    }

    return () => clearTimeout(autoSlideTimer);
  }, [currentIndex]);

  useEffect(() => {
    // Auto-slide after video ends
    if (isVideo(current?.imageUrl) && videoRef.current) {
      videoRef.current.onended = onNext;
    }
  }, [current?.imageUrl]);

  if (!current) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50">
      <motion.div
        key={current._id}
        className="relative w-80 h-96 sm:w-96 sm:h-[500px] bg-black rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, info) => {
          if (info.offset.x < -100) onNext();
          else if (info.offset.x > 100) onPrev();
        }}
      >
        {isVideo(current.imageUrl) ? (
          <video
            ref={videoRef}
            src={current.imageUrl}
            controls={false}
            autoPlay
            muted
            onLoadedData={() => setIsVideoLoaded(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={current.imageUrl}
            alt="Story"
            className="w-full h-full object-cover"
          />
        )}
        {/* {isOwnStory && (
          <div className="absolute bottom-2 left-2 bg-white text-black text-xs px-2 py-1 rounded shadow">
            👀 Viewers: {current.viewers?.length || 0}
          </div>
        )} */}
        {isOwnStory && (
          <div className="absolute bottom-2 left-2 flex flex-col gap-2 text-xs px-2">
            <div className="bg-white text-black px-2 py-1 rounded shadow">
              👀 Viewers: {current.viewers?.length || 0}
            </div>
            <button
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this story?")
                ) {
                  dispatch(deleteStory(current._id));
                  onNext(); // Go to next story after delete
                }
              }}
              className="bg-red-600 text-white px-2 py-1 rounded shadow"
            >
              🗑 Delete Story
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black bg-opacity-40 text-white px-2 py-1 rounded"
        >
          ✕
        </button>
      </motion.div>
    </div>
  );
};

export default StoryViewer;
