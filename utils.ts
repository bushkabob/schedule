import { ColorThemeData } from "./redux/colorThemeSlice"

export const getColor = (colorIndex: number, colors: string[]) => {
    return colors[colorIndex - colors.length * Math.floor(colorIndex/(colors.length))]
}

