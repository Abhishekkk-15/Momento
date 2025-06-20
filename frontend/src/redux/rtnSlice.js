import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "realTimeNotification",
  initialState: {
    likeNotification: [],
  },
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        if (!Array.isArray(state.likeNotification)) {
          state.likeNotification = [];
        }
        state.likeNotification.push(action.payload);
      } else if (action.payload.type === "dislike") {
        if (Array.isArray(state.likeNotification)) {
          state.likeNotification = state.likeNotification.filter(
            (item) => item.userId !== action.payload.userId
          );
        }
      }
    },
  },
});

export const { setLikeNotification } = rtnSlice.actions;
export default rtnSlice.reducer;
