import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AssignmentInfo {
    class: string
    name: string
    type: string
    date: string
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
                const curId = cur.class + cur.name
                if (curId.startsWith(id)) {
                    const postfix = parseInt(curId.substring(id.length))
                    if (postfix > acc) {
                        acc = postfix
                    }
                }
                return acc
            }, 0)
            const newAssignment = { ...action.payload.assignment, id: id + (postfix + 1) }
            state = [...state, newAssignment]
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

export const { addAssignment, removeAssignment, removeAllAssignments } = assingmentSlice.actions;
export default assingmentSlice.reducer;