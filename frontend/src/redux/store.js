// React Toolkit 사용
import { configureStore } from "@reduxjs/toolkit"
import recipeReducer from "./reducers/createSlice"

const store = configureStore({
    reducer : {
        recipe: recipeReducer
    }
})

export default store