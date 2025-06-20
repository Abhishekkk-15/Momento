// redux/storySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchStories = createAsyncThunk(
  "story/fetchStories",
  async (_, { getState }) => {
    const {
      auth: { user },
    } = getState();

    const token = user?.token || localStorage.getItem("token");

    const { data } = await axios.get("http://localhost:8080/api/v1/stories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  }
);


export const uploadStory = createAsyncThunk(
  "story/uploadStory",
  async (file, { getState }) => {
    const formData = new FormData();
    formData.append("file", file);

    const {
      auth: { user },
    } = getState(); 

    
    // console.log("Token:", user?.token) 
    const token = user?.token || localStorage.getItem("token");
    
    console.log("Current Redux user object:", user); // 🔍 Log full user object
    console.log("Token:", user?.token); 

    const { data } = await axios.post(
      "http://localhost:8080/api/v1/stories",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`, 
          // Authorization: `Bearer ${token}`, 
          
        },
        withCredentials: true,
        // Authorization: `Bearer ${token}`, // use the fallback-safe variable

      }
    );

    return data;
  }
);

export const deleteStory = createAsyncThunk(
  "story/deleteStory",
  async (id, { getState }) => {
    const {
      auth: { user },
    } = getState();

    const token = user?.token || localStorage.getItem("token");

    await axios.delete(`http://localhost:8080/api/v1/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return id;
  }
);


export const markStoryViewed = createAsyncThunk(
  "story/markStoryViewed",
  async (id, { getState }) => {
    const {
      auth: { user },
    } = getState();

    const token = user?.token || localStorage.getItem("token");

    await axios.put(
      `http://localhost:8080/api/v1/stories/view/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return id;
  }
);


export const fetchStoryViewers = createAsyncThunk(
  "story/fetchStoryViewers",
  async (id, { getState }) => {
    const {
      auth: { user },
    } = getState();

    const token = user?.token || localStorage.getItem("token");

    const { data } = await axios.get(
      `http://localhost:8080/api/v1/stories/viewers/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { id, viewers: data };
  }
);


// ─── Slice ────────────────────────────────────────────────────────────────────
const storySlice = createSlice({
  name: "story",
  initialState: {
    stories: [],
    loading: false,
    viewedStories: {},
    viewers: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        const payload = action.payload;

        state.stories = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.stories)
          ? payload.stories
          : [];

        state.loading = false;
      })
      

      .addCase(uploadStory.fulfilled, (state, action) => {
        state.stories.unshift(action.payload);
      })
      .addCase(deleteStory.fulfilled, (state, action) => {
        state.stories = state.stories.filter((s) => s._id !== action.payload);
      })
      .addCase(markStoryViewed.fulfilled, (state, action) => {
        state.viewedStories[action.payload] = true;
      })
      .addCase(fetchStoryViewers.fulfilled, (state, action) => {
        state.viewers[action.payload.id] = action.payload.viewers;
      });
  },
});

export default storySlice.reducer;
