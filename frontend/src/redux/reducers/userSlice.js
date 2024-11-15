import { createSlice } from "@reduxjs/toolkit";

const initState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initState,

  reducers: {
    setUser: (state, action) => {
      const { user } = action.payload;
      state.user = user;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
