import { Ionicons } from "@expo/vector-icons"
import React from "react"
import { View, Text, StyleSheet } from "react-native"
import GestureRecognizer from "react-native-swipe-gestures"
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux"
import { RootState } from "./redux"
import { getColor } from "./utils";
import { useTheme } from "./Theme/ThemeProvider";

interface swipeableCalendarProps {
    forDate: Date,
    increment: () => void,
    decrement: () => void,
    setSelecteDate: (date: Date) => void,
    selectedDate: Date,
    activeIndicies: number[][]
}

const SwipeableCalendar = (props: swipeableCalendarProps) => {
    const systemColors = useTheme()
    //getting color theme
    const theme = useSelector((state: RootState) => state.colorTheme.colorThemes.filter((colorTheme) => colorTheme.name === state.colorTheme.selected)[0])
    //create a function that returns an array of dates for the months that contain the forDate starting at Sunday and ending at Saturday
    const getDates = (forDate: Date) => {
        const month = forDate.getMonth()
        const year = forDate.getFullYear()
        const date = forDate.getDate() - forDate.getDay()
        const dates: [string, Date, boolean][] = []
        const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        for (let i = 0; i < 7; i++) {
            const newDate = new Date(year, month, date + i)
            dates.push([daysOfTheWeek[i], newDate, newDate.toDateString() === props.selectedDate.toDateString()])
        }
        return dates
    }

    const dates = getDates(props.forDate)
    const month = props.forDate.toLocaleString('default', { month: 'long' })
    const year = props.forDate.getFullYear()
    
    const circleHeight = 5;
    return (
        <View style={styles.container}>
            <View style={{width:"100%"}}>
                <Text style={{alignSelf:"center", paddingTop: 10, color: systemColors.textColor}}>{month + ", " + year}</Text>
                <GestureRecognizer onSwipeRight={props.decrement} onSwipeLeft={props.increment} >
                    <View style={styles.calendarTitleRow}>
                        <TouchableOpacity onPress={props.decrement}>
                            <Ionicons name="ios-arrow-back" color={systemColors.textColor} size={16} />
                        </TouchableOpacity>
                            {dates.map(([day, date, selected], index) => (
                                <View key={day}>
                                    <View style={{flexGrow: 1}}>
                                        <Text key={day} style={[styles.calendarTitle, {color: systemColors.textColor}]}>{day}</Text>
                                        <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', aspectRatio: 1, borderRadius: 60}, selected?{backgroundColor: systemColors.red}:{}]}>
                                            <Text style={[styles.calendarTitle, {color:selected?"white":systemColors.textColor}]} key={date.getDate()}>{date.getDate()}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <View style={{justifyContent: "center", alignItems: "center", paddingTop: 3}}>
                                                <View style={{flexDirection: "row", height: circleHeight, justifyContent: "center", margin: 1, width: circleHeight*6}}>
                                                    {props.activeIndicies[index].slice(0,4).map((colorIndex) => {
                                                        return <View key={colorIndex} style={{height: circleHeight, width: circleHeight, marginHorizontal: 1, borderRadius: 60, backgroundColor: getColor(colorIndex, theme.colors)}} />
                                                    })
                                                    }
                                                </View>
                                                <View style={{flexDirection: "row", height: circleHeight, margin: 1, justifyContent: "center", width: circleHeight*6}}>
                                                    {props.activeIndicies[index].slice(4,8).map((colorIndex) => {
                                                        return <View key={colorIndex} style={{height: circleHeight, width: circleHeight, marginHorizontal: 1, borderRadius: 60, backgroundColor: getColor(colorIndex, theme.colors)}} />
                                                    })
                                                    }
                                                </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        <TouchableOpacity onPress={props.increment} >
                            <Ionicons name="ios-arrow-forward" color={systemColors.textColor} size={16} />
                        </TouchableOpacity>
                    </View>
                </GestureRecognizer>
            </View>
        </View>
    );
}

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