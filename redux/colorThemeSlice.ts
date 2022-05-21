import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ColorThemeData {
    name: string,
    isEditable: boolean,
    colors: string[]
}

interface ColorThemeState {
    selected: string,
    colorThemes: ColorThemeData[]
}

const initialState: ColorThemeState = {
    selected: "Default",
    colorThemes: [{name: "Default", isEditable: false, colors: ["#ff210c", "#FFA500", "#FFFD54", "#00FF00", "#ADD8E6", "#0000FF", "#A020F0", "#FFC0CB"]}]
}

const colorThemeSlice = createSlice({
    name: "colorTheme",
    initialState,
    reducers: {
        selectColorTheme(state, action: PayloadAction<string>) {
            state.selected = action.payload
            return state
        },
        addColorTheme(state, action: PayloadAction<ColorThemeData>) {
            state.colorThemes.push(action.payload)
            return state
        },
        removeColorTheme(state, action: PayloadAction<string>) {
            state.colorThemes = state.colorThemes.filter(theme => theme.name !== action.payload)
            return state
        }
    }
})

export const { selectColorTheme } = colorThemeSlice.actions;
export default colorThemeSlice.reducer;