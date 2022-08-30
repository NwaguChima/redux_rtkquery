import {
  createSlice,
  createAsyncThunk,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const postAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postAdapter.getInitialState({
  status: "idle", // idle, loading, succeeded, failed
  error: null,
  count: 0,
});

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  try {
    const response = await axios.get(POSTS_URL);
    return [...response.data];
  } catch (error) {
    return error.message;
  }
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost) => {
    try {
      const response = await axios.post(POSTS_URL, initialPost);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (updatedPost) => {
    const { id } = updatedPost;
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, updatedPost);
      return response.data;
    } catch (error) {
      return error.message;
    }
  }
);

export const deletePost = createAsyncThunk("posts/deletePost", async (post) => {
  const { id } = post;
  try {
    const response = await axios.delete(`${POSTS_URL}/${id}`);
    if (response?.status === 200) return post;

    return `${response?.status}: ${response?.statusText}`;
  } catch (error) {
    return error.message;
  }
});

export const postsSlice = createSlice({
  name: "posts",
  initialState,

  reducers: {
    // postAdded: {
    //   reducer(state, action) {
    //     state.posts.push(action.payload);
    //   },
    //   prepare(title, content, userId) {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         title,
    //         content,
    //         date: new Date().toISOString(),
    //         userId,
    //         reactions: {
    //           thumbsUp: 0,
    //           wow: 0,
    //           heart: 0,
    //           rocket: 0,
    //           coffee: 0,
    //         },
    //       },
    //     };
    //   },
    // },
    reactionAdded: (state, action) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    increaseCount: (state, action) => {
      state.count = state.count + 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // adding date and reactions to the posts
        let min = 1;
        let loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });

        // add any fetched posts to the array of posts
        postAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        postAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Updae could not complete");
          console.log(action.payload);
          return;
        }

        action.payload.date = new Date().toISOString();
        postAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("Delete could not complete");
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        postAdapter.removeOne(state, id);
      });
  },
});

export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

export const seletPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId);

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);

export const { increaseCount, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
