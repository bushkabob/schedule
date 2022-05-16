import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type changeClassProps = { name: string }

const initialState: string[] = []

const classSlice = createSlice({
    name: "classes",
    initialState,
    reducers: {
        addClass(state, action: PayloadAction<changeClassProps>) {
            state = [...state, action.payload.name]
            return state
        },
        removeClass(state, action: PayloadAction<changeClassProps>) {
            const index = state.indexOf(action.payload.name)
            state = [...state.slice(0, index), ...state.slice(index + 1)]
            return state
        }
    }
})

export const { addClass, removeClass } = classSlice.actions;
export default classSlice.reducer;