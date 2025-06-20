import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUsersBySearch = createAsyncThunk(
  "search/fetchUsersBySearch",
  async (searchTerm) => {
    const { data } = await axios.get(`https://momento-7gr6.onrender.com/api/v1/user/search?username=${searchTerm}`, { withCredentials: true });
    return data.users;
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersBySearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersBySearch.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersBySearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default searchSlice.reducer;
