import { combineReducers } from "redux";
import classReducer from "./classSlice"
import assignmentTypeReducer from "./assignmentTypeSlice"
import assignmentReducer from "./assingmentsSlice"
import colorThemeReducer from "./colorThemeSlice"

export const rootReducer = combineReducers({
    classes: classReducer,
    assignmentTypes: assignmentTypeReducer,
    assignments: assignmentReducer,
    colorTheme: colorThemeReducer,
})

export type RootState = ReturnType<typeof rootReducer>