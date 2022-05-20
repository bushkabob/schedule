import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type changeTypeProps = { name: string }

const initialState: string[] = ["Test", "Quiz", "Homework", "Paper", "Lab Report"]

const assignmentTypeSlice = createSlice({
    name: "assignmentTypes",
    initialState,
    reducers: {
        addAssignmentType(state, action: PayloadAction<changeTypeProps>) {
            state = [...state, action.payload.name]
            return state
        },
        removeAssignmentType(state, action: PayloadAction<changeTypeProps>) {
            const index = state.indexOf(action.payload.name)
            state = [...state.slice(0, index), ...state.slice(index + 1)]
            return state
        },
        reorderAssignmentTypes(state, action: PayloadAction<string[]>) {
            state = action.payload
            return state
        },
    }
})

export const { addAssignmentType, removeAssignmentType, reorderAssignmentTypes } = assignmentTypeSlice.actions;
export default assignmentTypeSlice.reducer;