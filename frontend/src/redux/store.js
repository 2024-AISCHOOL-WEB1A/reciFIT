// React Toolkit 사용
import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "./reducers/createSlice";
import userReducer from "./reducers/userSlice";

const store = configureStore({
  reducer: {
    recipe: recipeReducer,
    user: userReducer,
  },
});

export default store;
