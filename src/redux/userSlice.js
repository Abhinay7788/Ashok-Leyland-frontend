import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: null,
    isAuthenticated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;