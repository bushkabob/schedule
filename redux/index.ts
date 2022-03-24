import { combineReducers } from "redux";
import classReducer from "./classSlice"

export const rootReducer = combineReducers({
    classes: classReducer
})

export type RootState = ReturnType<typeof rootReducer>