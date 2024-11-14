import { createSlice } from "@reduxjs/toolkit";

const initState = {
  userIdx: 0,
  userName: "",
  provider: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState: initState,

  reducers: {
    serUser: (state, action) => {
      const { userIdx, userName, provider } = action.payload;
      state.userIdx = userIdx;
      state.userName = userName;
      state.provider = provider;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
