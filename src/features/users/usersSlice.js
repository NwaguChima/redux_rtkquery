import { createSlice } from "@reduxjs/toolkit";

const initialState = [
  { id: "0", name: "Dude Lebowski" },
  { id: "2", name: "Corner McQuarters" },
  { id: "3", name: "The Dude" },
];

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export const selectAllUsers = (state) => state.users;

export default usersSlice.reducer;
