import { ColorThemeData } from "./redux/colorThemeSlice"
import { useTheme } from "./Theme/ThemeProvider"
import { View, Text, StyleSheet } from "react-native"
import React from "react"
import { getColor } from "./utils"

interface WeekRowProps {
    forDates: (Date | null)[],
    selectedDate: Date,
    activeIndicies: number[][]
}

const WeekRow = (props: WeekRowProps & {theme: ColorThemeData}) => {
    const systemColors = useTheme()
    // const getDates = (forDate: Date | null) => {
    //     if (forDate !== null){
    //         const month = forDate.getMonth()
    //         const year = forDate.getFullYear()
    //         const date = forDate.getDate() - forDate.getDay()
    //         const dates: [string, Date, boolean][] = []
    //         const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    //         for (let i = 0; i < 7; i++) {
    //             const newDate = new Date(year, month, date + i)
    //             dates.push([daysOfTheWeek[i], newDate, newDate.toDateString() === props.selectedDate.toDateString()])
    //     }
    //     return dates
    // }
    //<Text style={{alignSelf:"center", paddingTop: 10, color: systemColors.textColor}}>{month + ", " + year}</Text>
    //const dates = getDates(props.forDate)
    const dates = props.forDates.map((date) => {
        return {date: date, isSelected: date?.toDateString() === props.selectedDate.toDateString()}
    })
    const circleHeight = 5;
    /*
    onLayout={(event) => {
            var {x, y, width, height} = event.nativeEvent.layout;
            console.log(x + " " + y + " " + width + " " + height)
        }
    */
    return (
        <View style={[{width: "100%"}, styles.calendarTitleRow]}>
            {dates.map((item, index) => (
                <View key={index}>
                    <View style={{flexGrow: 1}}>
                        <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', aspectRatio: 1, borderRadius: 60}, item.isSelected?{backgroundColor: systemColors.red}:{}]}>
                            <Text style={[styles.calendarTitle, {color:item.isSelected?"white":systemColors.textColor}]} key={item.date!==null?item.date.getDate():index}>{item.date!==null?item.date.getDate():""}</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{justifyContent: "center", alignItems: "center", paddingTop: 3}}>
                                <View style={{flexDirection: "row", height: circleHeight, justifyContent: "center", margin: 1, width: circleHeight*6}}>
                                    {props.activeIndicies[index].slice(0,4).map((colorIndex) => {
                                        return <View key={colorIndex} style={{height: circleHeight, width: circleHeight, marginHorizontal: 1, borderRadius: 60, backgroundColor: getColor(colorIndex, props.theme.colors)}} />
                                    })
                                    }
                                </View>
                                <View style={{flexDirection: "row", height: circleHeight, margin: 1, justifyContent: "center", width: circleHeight*6}}>
                                    {props.activeIndicies[index].slice(4,8).map((colorIndex) => {
                                        return <View key={colorIndex} style={{height: circleHeight, width: circleHeight, marginHorizontal: 1, borderRadius: 60, backgroundColor: getColor(colorIndex, props.theme.colors)}} />
                                    })
                                    }
                                </View>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
}

export default WeekRow

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