import { Platform } from "react-native";

export const getColor = (colorIndex: number, colors: string[]) => {
    return colors[colorIndex - colors.length * Math.floor(colorIndex/(colors.length))]
}

export const getDateString = (date: Date) => {
    date.setTime(date.getTime() + date.getTimezoneOffset() * 60000)
    if (Platform.OS === 'ios')
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
        });
    else {

        const monthName = ["January", "February", "March", "April", "May", "June",
                         "July", "August", "September", "October", "November", "December"]
        return monthName[date.getMonth()] + " " + date.getFullYear();
    }
}