import { useFocusEffect, useNavigation } from "@react-navigation/native"
import React, { useLayoutEffect } from "react"
import { View, Button } from "react-native"
import { CalendarList } from "react-native-calendars"
import { useSelector } from "react-redux"
import { RootState } from "./redux"
import { StoredAssignmentInfo } from "./redux/assingmentsSlice"
import { useTheme } from "./Theme/ThemeProvider"
import { getColor } from "./utils"

const Calendar = () => {
    const navigation = useNavigation()
    const assignments = useSelector((state: RootState) => state.assignments)
    const theme = useSelector((state: RootState) => state.colorTheme.colorThemes.filter((colorTheme) => colorTheme.name === state.colorTheme.selected)[0])
    const clasess = useSelector((state: RootState) => state.classes)
    const systemColors = useTheme()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: ()=><Button title='Back' onPress={() => navigation.goBack()} />
        })
    })

    useFocusEffect(() => {
        console.log("test")
    })

    const dateDots = (assignments: StoredAssignmentInfo[]) => {
        const dates: {[key: string]: {dots: {color: string}[]}} = {}
        assignments.forEach((item) => {
            const date = new Date(item.date)
            const offset = date.getTimezoneOffset()
            date.setTime(date.getTime() + offset*60*1000)
            const dateString = date.toISOString().slice(0,10)
            const assingmentIndex = clasess.indexOf(item.class)
            Object.keys(dates).includes(dateString) ?
            dates[dateString].dots.push({color: getColor(assingmentIndex, theme.colors)})
            :
            dates[dateString] = {dots: [{color: getColor(assingmentIndex, theme.colors)}]}
        })
        return dates
    }

    const dots = dateDots(assignments)

    return(
        <View>
            <CalendarList 
                markedDates={dots} 
                markingType="multi-dot"
                theme={{
                    calendarBackground: systemColors.background,
                    backgroundColor: systemColors.background,
                    dayTextColor: systemColors.textColor
                }} 
            />
        </View>
    )
}

export default Calendar