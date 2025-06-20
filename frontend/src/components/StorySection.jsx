// export default StorySection;
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStories,
  deleteStory,
  markStoryViewed,
  fetchStoryViewers,
  uploadStory,
} from "../redux/storySlice";
import AddStory from "./AddStory";
import Stories from "react-insta-stories";

const StorySection = () => {
  const dispatch = useDispatch();
  const { stories, loading, viewers, viewedStories } = useSelector(
    (state) => state.story
  );
  const { user } = useSelector((state) => state.auth);
  const storiesRef = useRef(null);

  const [viewerIndex, setViewerIndex] = useState(null);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [currentUserStoryGroup, setCurrentUserStoryGroup] = useState([]);

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  const groupedStories = {};
  if (Array.isArray(stories)) {
    stories.forEach((story) => {
      const userId = story.userId._id;
      if (!groupedStories[userId]) {
        groupedStories[userId] = {
          user: story.userId,
          stories: [],
        };
      }
      groupedStories[userId].stories.push(story);
    });
  }

  const myStoryGroup = groupedStories[user?._id];
  const otherUsersStories = Object.values(groupedStories).filter(
    (group) => group.user._id !== user._id
  );

  const isStoryViewed = (story) => viewedStories[story._id];

  const allGroups = myStoryGroup
    ? [myStoryGroup, ...otherUsersStories]
    : otherUsersStories;

  const groupedStorySlides = allGroups.map((group) =>
    group.stories.map((story) => ({
      url: story.imageUrl,
      type: story.imageUrl.includes(".mp4") ? "video" : "image",
      header: {
        heading: group.user.username,
        profileImage: group.user.profilePicture || "/default.jpg",
        storyId: story._id,
        userId: group.user._id,
      },
      originalContent: story,
      seeMore:
        group.user._id === user._id
          ? ({ close }) => (
              <div className="fixed bottom-0 left-0 w-full h-[50vh] bg-white overflow-y-auto rounded-t-lg shadow-lg z-50 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Viewers
                    <p className="text-sm text-gray-600 mb-2">
                      Total Views: {viewers[story._id]?.length || 0}
                    </p>
                  </h4>
                  <button
                    onClick={close}
                    className="text-gray-500 hover:text-red-500 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
                {viewers[story._id]?.length > 0 ? (
                  <ul className="space-y-2">
                    {viewers[story._id].map((viewer) => (
                      <li
                        key={viewer._id}
                        className="flex items-center justify-center bg-blue-500 gap-2 p-2"
                      >
                        <img
                          src={viewer.profilePicture || "/default.jpg"}
                          alt={viewer.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className=" font-medium text-white">
                          {viewer.username}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No viewers yet.</p>
                )}
              </div>
            )
          : null,
    }))
  );

  const openViewer = (storyId) => {
    const group = groupedStorySlides.find((group) =>
      group.some((s) => s.header.storyId === storyId)
    );

    if (!group) return;

    const storyIndex = group.findIndex((s) => s.header.storyId === storyId);
    setCurrentUserStoryGroup(group);
    setViewerIndex(storyIndex);
    setShowViewerModal(true);

    dispatch(markStoryViewed(storyId));
    dispatch(fetchStoryViewers(storyId));
  };

  const closeViewer = () => {
    setShowViewerModal(false);
    setViewerIndex(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    dispatch(uploadStory(file));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      dispatch(deleteStory(id));
      if (
        viewerIndex !== null &&
        currentUserStoryGroup[viewerIndex]?.header?.storyId === id
      ) {
        closeViewer();
      }
    }
  };

  return (
    <div>
      <div className="flex gap-4 overflow-x-scroll p-4 bg-white rounded-md shadow scroll-smooth snap-x snap-mandatory">
        {myStoryGroup ? (
          <div className="text-center relative snap-start group">
            <div
              className={`w-20 h-20 rounded-full p-[2px] relative ${
                myStoryGroup.stories.every(isStoryViewed)
                  ? "bg-gray-300"
                  : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
              }`}
            >
              <div
                onClick={() => openViewer(myStoryGroup.stories[0]._id)}
                className="w-full h-full rounded-full overflow-hidden cursor-pointer"
              >
                <img
                  src={myStoryGroup.user.profilePicture || "/default.jpg"}
                  alt={myStoryGroup.user.username}
                  className="w-full h-full rounded-full border-2 border-white object-cover"
                />
              </div>

              <label
                htmlFor="add-story-file"
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center cursor-pointer"
                title="Add Story"
              >
                +
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                id="add-story-file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            <p className="text-xs mt-1 truncate w-20">
              {myStoryGroup.user.username}
            </p>

            <button
              onClick={() => handleDelete(myStoryGroup.stories[0]._id)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >
              ×
            </button>

            {viewers[myStoryGroup.stories[0]._id]?.length > 0 && (
              <div
                className="text-xs mt-1 cursor-pointer text-blue-600 underline"
                onClick={() => openViewer(myStoryGroup.stories[0]._id)}
              ></div>
            )}
          </div>
        ) : (
          <div className="snap-start">
            <AddStory />
          </div>
        )}

        {!loading &&
          otherUsersStories.map((group) => {
            const firstStory = group.stories[0];
            const isViewed = group.stories.every(isStoryViewed);
            const viewerCount = group.stories.reduce(
              (acc, s) => acc + (viewers[s._id]?.length || 0),
              0
            );

            return (
              <div
                key={group.user._id}
                className="text-center relative snap-start"
              >
                <div
                  onClick={() => openViewer(firstStory._id)}
                  className={`w-20 h-20 rounded-full p-[2px] cursor-pointer ${
                    isViewed
                      ? "bg-gray-300"
                      : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
                  }`}
                >
                  <img
                    src={group.user.profilePicture || "/default.jpg"}
                    alt={group.user.username}
                    className="w-full h-full rounded-full border-2 border-white object-cover"
                  />
                </div>
                <p className="text-xs mt-1 truncate w-20">
                  {group.user.username}
                </p>
                {viewerCount > 0 && (
                  <div
                    className="text-xs mt-1 cursor-pointer text-blue-600 underline"
                    onClick={() => openViewer(firstStory._id)}
                  ></div>
                )}
              </div>
            );
          })}
      </div>

      {showViewerModal && viewerIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
          <div className="w-[90%] md:w-[400px]">
            <Stories
              stories={currentUserStoryGroup}
              currentIndex={viewerIndex}
              defaultInterval={5000}
              width="100%"
              height="700px"
              onAllStoriesEnd={closeViewer}
              onStoryStart={(story, index) => {
                if (story?.header?.storyId) {
                  const storyId = story.header.storyId;
                  dispatch(markStoryViewed(storyId));
                  dispatch(fetchStoryViewers(storyId));
                }
              }}
              
            />

            <button
              onClick={closeViewer}
              className="absolute top-5 right-5 bg-red-600 text-white rounded-full w-10 h-10 font-bold flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
//ye wala rkhna hai

export default StorySection;
