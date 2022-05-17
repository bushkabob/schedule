import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AssignmentInfo {
    class: string
    name: string
    type: string
    date: string
    completed: boolean
}

export interface StoredAssignmentInfo extends AssignmentInfo {
    id: string
}

type AddAssingmentProps = { assignment: AssignmentInfo }

const initialState: StoredAssignmentInfo[] = []

const assingmentSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        addAssignment(state, action: PayloadAction<AddAssingmentProps>) {
            const id = action.payload.assignment.class + action.payload.assignment.name
            const postfix = state.reduce((acc, cur) => {
                if (cur.id.startsWith(id)) {
                    //extract the postfix from the id
                    const postfix = parseInt(cur.id.replace(/[^0-9\.]/g, ''), 10);
                    if (postfix >= acc) {
                        acc = postfix;
                    }
                }
                return acc
            }, 0)
            const newAssignment = { ...action.payload.assignment, id: id + (postfix + 1) }
            const index = state.findIndex(assignment => new Date(assignment.date) > new Date(newAssignment.date))
            state = index === -1 ? [...state, newAssignment] : [...state.slice(0, index), newAssignment, ...state.slice(index)]
            return state
        },
        updateAssignmentCompleted(state, action: PayloadAction<{ id: string, completed: boolean }>) {
            const index = state.findIndex(assignment => assignment.id === action.payload.id)
            if (index !== -1) {
                state[index].completed = action.payload.completed
            }
            return state
        },
        updateAssignment(state, action: PayloadAction<{ id: string, assignment: AssignmentInfo }>) {
            const index = state.findIndex(assignment => assignment.id === action.payload.id)
            if (index !== -1) {
                state[index] = { ...state[index], ...action.payload.assignment }
            }
            return state
        },
        removeAssignment(state, action: PayloadAction<{id: string}>) {
            const index = state.findIndex(assignment => assignment.id === action.payload.id)
            state = [...state.slice(0, index), ...state.slice(index + 1)]
            return state
        },
        removeAllAssignments(state) {
            state = []
            return state
        }

    }
})

export const { addAssignment, removeAssignment, removeAllAssignments, updateAssignmentCompleted, updateAssignment } = assingmentSlice.actions;
export default assingmentSlice.reducer;