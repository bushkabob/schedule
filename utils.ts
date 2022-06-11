import { ColorThemeData } from "./redux/colorThemeSlice"

export const getColor = (colorIndex: number, colors: string[]) => {
    return colors[colorIndex - Math.floor(colorIndex/(colors.length-1))]
}

