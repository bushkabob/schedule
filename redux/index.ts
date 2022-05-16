import { combineReducers } from "redux";
import classReducer from "./classSlice"
import assignmentTypeReducer from "./assignmentTypeSlice"
import assignmentReducer from "./assingmentsSlice"

export const rootReducer = combineReducers({
    classes: classReducer,
    assignmentTypes: assignmentTypeReducer,
    assignments: assignmentReducer
})

export type RootState = ReturnType<typeof rootReducer>