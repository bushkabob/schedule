import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface ColorThemeData {
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
    colorThemes: [
        {name: "Default", isEditable: false, colors: ["hsl(0, 100%, 50%)", "hsl(29, 100%, 50%)", "hsl(58, 100%, 50%)", "hsl(91, 100%, 50%)", "hsl(185, 100%, 50%)", "hsl(245, 100%, 50%)", "hsl(280, 100%, 50%)", "hsl(308, 100%, 50%)"]},
        {name: "Light", isEditable: false, colors: ["hsl(0, 100%, 75%)", "hsl(29, 100%, 75%)", "hsl(58, 100%, 75%)", "hsl(91, 100%, 75%)", "hsl(185, 100%, 75%)", "hsl(245, 100%, 75%)", "hsl(280, 100%, 75%)", "hsl(308, 100%, 75%)"]},
        {name: "Dark", isEditable: false, colors: ["hsl(0, 100%, 35%)", "hsl(29, 100%, 35%)", "hsl(58, 100%, 35%)", "hsl(91, 100%, 35%)", "hsl(185, 100%, 35%)", "hsl(245, 100%, 35%)", "hsl(280, 100%, 35%)", "hsl(308, 100%, 35%)"]},
    ]
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
        },
    }
})

export const { selectColorTheme, addColorTheme, removeColorTheme } = colorThemeSlice.actions;
export default colorThemeSlice.reducer;