// React Toolkit 사용
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./reducers/userSlice";

// Redux Persist 설정
const persistConfig = {
  key: "user",
  storage,
};

// Persisted Reducer 생성
const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
});

// Persistor 생성
export const persistor = persistStore(store);

export default store;
