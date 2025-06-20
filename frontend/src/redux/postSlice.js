import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    selectedPost: null,
    bookmark : [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    // setBookmark: (state, action) => {
    //   state.bookmark = action.payload;
    // },
   
  },
});
export const { setPosts, setSelectedPost,  } = postSlice.actions;
export default postSlice.reducer;
