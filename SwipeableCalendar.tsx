import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { View, StyleSheet } from "react-native"
import GestureRecognizer from "react-native-swipe-gestures"
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux"
import { RootState } from "./redux"
import { useTheme } from "./Theme/ThemeProvider";
import WeekRow from "./WeekRow";

interface SwipeableCalendarProps {
    forDate: Date,
    increment: () => void,
    decrement: () => void,
    setSelectedDate: (date: Date) => void,
    selectedDate: Date,
    activeIndicies: number[][]
}

const SwipeableCalendar = (props: SwipeableCalendarProps) => {
    const systemColors = useTheme()
    //getting color theme
    const theme = useSelector((state: RootState) => state.colorTheme.colorThemes.filter((colorTheme) => colorTheme.name === state.colorTheme.selected)[0])
    //create a function that returns an array of dates for the months that contain the forDate starting at Sunday and ending at Saturday
    const month = props.forDate.toLocaleString('default', { month: 'long' })
    const year = props.forDate.getFullYear()
    return (
        <View style={styles.container}>
            <View style={{width:"100%"}}>
                <GestureRecognizer onSwipeRight={props.decrement} onSwipeLeft={props.increment} >
                    <View style={styles.calendarTitleRow}>
                        <TouchableOpacity onPress={props.decrement}>
                            <Ionicons name="ios-arrow-back" color={systemColors.textColor} size={16} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPress={props.increment} >
                            <Ionicons name="ios-arrow-forward" color={systemColors.textColor} size={16} />
                        </TouchableOpacity>
                    </View>
                </GestureRecognizer>
            </View>
        </View>
    )
}

//<WeekRow {...props} theme={theme} />

export default SwipeableCalendar;

const styles = StyleSheet.create({
    container: {
      width: "100%",
    },
    calendarView: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      flexDirection: "column",
    },
    calendarTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    calendarTitle: {
        textAlign: 'center',
    },
    calendarListView: {
        flex: 1,
        width: '100%',
    },
});