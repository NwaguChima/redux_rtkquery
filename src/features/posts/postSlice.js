import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  {
    id: 1,
    title: "Learning Redux toolkit",
    content: "Ive been looking at this for a while",
  },
  {
    id: 2,
    title: "Learning React",
    content: "Ive been looking at this for a while",
  },
];

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
});

export const selectAllPosts = (state) => state.posts;

export default postSlice.reducer;
