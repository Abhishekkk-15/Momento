import { createSlice } from "@reduxjs/toolkit";

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // user: null,
    user: userInfoFromStorage,
    suggestedUsers: [],
    userProfile: null,
    selectedUser: null,
  },
  reducers: {
    //actions
    setAuthUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    updateFollowing: (state, action) => {
      const userId = action.payload;

      // Step 1: Update logged-in user's following list
      if (!state.user.following) {
        state.user.following = [];
      }

      const isFollowing = state.user.following.includes(userId);
      if (isFollowing) {
        // Unfollow
        state.user.following = state.user.following.filter(
          (id) => id !== userId
        );
      } else {
        // Follow
        state.user.following.push(userId);
      }

      // Step 2: Update userProfile followers list if the profile matches
      if (state.userProfile && state.userProfile._id === userId) {
        if (isFollowing) {
          state.userProfile.followers = state.userProfile.followers.filter(
            (id) => id !== state.user._id
          );
        } else {
          state.userProfile.followers.push(state.user._id);
        }
      }

      // Step 3: Update suggestedUsers' followers if it includes that user
      state.suggestedUsers = state.suggestedUsers.map((user) => {
        if (user._id === userId) {
          const isAlreadyFollowed = user.followers.includes(state.user._id);
          return {
            ...user,
            followers: isAlreadyFollowed
              ? user.followers.filter((id) => id !== state.user._id)
              : [...user.followers, state.user._id],
          };
        }
        return user;
      });

      localStorage.setItem("userInfo", JSON.stringify(state.user));
    },
  },
});
export const {
  setAuthUser,
  setSuggestedUsers,
  setUserProfile,
  setSelectedUser,
  updateFollowing,
} = authSlice.actions;
export default authSlice.reducer;
