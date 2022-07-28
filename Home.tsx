import { View, StyleSheet, Text, Platform, Appearance } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from "react";
import AssignmentsView from "./AssignmentsView";
import { useSelector } from "react-redux";
import { RootState } from "./redux";
import { useTheme } from "./Theme/ThemeProvider";
import Animated, { useSharedValue } from "react-native-reanimated";
import { CalendarProvider, WeekCalendar } from "react-native-calendars";
import { lightColors } from "./Theme/colorThemes";
import { getColor } from "./utils";
import { FlatList } from "react-native-gesture-handler";
import { StoredAssignmentInfo } from "./redux/assingmentsSlice";

const HomeScreen = () => {
    const initialDate = new Date(Date.now()).toDateString();
    const [selectedDate, setSelectedDate] = useState(initialDate)
    const systemColors = useTheme()
    const colorScheme = (typeof Appearance.getColorScheme() === "string" ? Appearance.getColorScheme() : "light") as string
    const [flatListColor, setFlatlistColor] = useState(colorScheme)

    const offsetVal = useSharedValue(0)
    const flatListRef = useRef<FlatList>(null)
    
    // const animatedStyle = useAnimatedStyle(() => {
    //     return offsetVal.value > 0 ? {
    //         elevation: 99, shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: {height: 2, width: 0}, zIndex: 99
    //     } : {
    //         elevation: 1, shadowOpacity: 0.0, shadowRadius: 0, shadowOffset: {height: 2, width: 0}, zIndex: 1
    //     }
    // }, [offsetVal])

    const date = new Date(selectedDate)
    const offset = date.getTimezoneOffset()
    date.setTime(date.getTime() + offset*60*1000)
    const selectedDateString = date.toISOString()
    const day = date.getDay()
    const diff = date.getDate() - day
    const weekStart = new Date(date.setDate(diff))
    weekStart.setDate(weekStart.getDate() - 7)
    const weekStartString = weekStart.toISOString()
    const weekEnd = new Date(weekStartString)
    const assignments = useSelector((state: RootState) => state.assignments.filter(assignment => !assignment.completed || assignment.date > selectedDateString));
    const weekEndString = new Date(weekEnd.setDate(weekEnd.getDate() + 20)).toISOString()
    const theme = useSelector((state: RootState) => state.colorTheme.colorThemes.filter((colorTheme) => colorTheme.name === state.colorTheme.selected)[0])
    //create an object that contains that has the dates for the week in the format of "yyyy-mm-dd" as the keys and empty arrays as the values
    const weekDates = Array.from(Array(21).keys()).reduce((acc, _, i) => {
        const date = weekStart
        const dateString = date.toISOString().slice(0, 10)
        date.setDate(date.getDate() + 1)
        return { ...acc, [dateString]: [] }
    }, {} as { [key: string]: string[] })
    //For color indictors
    //check if  assignments[0] has a date within the week of the selected date
    const visibleAssigmentClasses = assignments.reduce((prev, assignment) => {
        const time = new Date(assignment.date).getTime()
        const assignmentDate = new Date(time - offset*60*1000).toISOString().substring(0, 10)
        const weekStart = weekStartString.substring(0, 10)
        const weekEnd = weekEndString.substring(0, 10)
        if (assignmentDate >= weekStart && assignmentDate <= weekEnd) {
            prev[assignmentDate].push(assignment.class)
        }
        return prev
    }, weekDates)
    const visibleAssignmentArray: string[][] = Object.keys(visibleAssigmentClasses).map(key => visibleAssigmentClasses[key])
    const classes = useSelector((state: RootState) => state.classes)
    const activeIndicies = visibleAssignmentArray.map((dayClasses) => dayClasses.reduce((prev, className) => {!prev.includes(classes.indexOf(className)) && prev.push(classes.indexOf(className)); return prev}, [] as number[]))
    const points: {[key: string]:any} = {}
    for (const [key, value] of Object.entries(weekDates)) {
        points[key] = {dots: activeIndicies[Object.keys(weekDates).indexOf(key)].map((index) => {return {color: getColor(index, theme.colors)}})}
    }
    const updateSharedValue = (val: number) => {
        'worklet';
        offsetVal.value = val
    }

    //organize the asssignments into an array that contains objects with the date and the assignments for that date
    const organizeAssignments = (assignments: StoredAssignmentInfo[]) => {
        const organizedAssignments: { date: string, isFirstofMonth: boolean, assignments: StoredAssignmentInfo[] }[] = [];
        var currentMonth = 0;
        assignments.forEach((assignment) => {
            const assignmentDate = new Date(assignment.date)
            const assignmentIndex = organizedAssignments.findIndex((assignment) => assignment.date === assignmentDate.toDateString());
            if (assignmentIndex === -1) {
                const monthMatch = assignmentDate.getMonth() === currentMonth;
                organizedAssignments.push({ date: assignmentDate.toDateString(), assignments: [assignment], isFirstofMonth: !monthMatch })
                currentMonth = assignmentDate.getMonth();
            } else {
                organizedAssignments[assignmentIndex].assignments.push(assignment)
            }
        })
        return organizedAssignments;
    }

    const organizedAssignments = organizeAssignments(assignments)

    //Scrolls the scrollview to the appropriate date on date change
    const selectDate = (date: string) => {
        setSelectedDate(date)
        const reducedAssignments = assignments.reduce((prev: string[], val: StoredAssignmentInfo) => {
            const time = new Date(val.date).getTime()
            const assignmentDate = new Date(time - offset*60*1000).toISOString().substring(0, 10)
            if(prev.includes(assignmentDate)){
                return prev
            } else {
                prev.push(assignmentDate)
                return prev
            }
        }, [])
        //console.log(reducedAssignments)
        const tempAssingmentIndex = reducedAssignments.findIndex((val: string) => {
            return date.substring(0, 10) <= val.substring(0, 10)
        })
        const assingmentIndex = tempAssingmentIndex === -1 ? reducedAssignments.length - 1 : tempAssingmentIndex
        flatListRef.current?.scrollToIndex({animated: true, index: assingmentIndex})
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={[styles.calendarView, {backgroundColor: systemColors.background}]}>
                <Animated.View style={[{backgroundColor: systemColors.background, shadowColor: "rgb(133, 143, 150)"}]}>
                    <Text style={{marginTop: 10, fontSize: 16, textAlign: "center", color: systemColors.textColor}}>{(new Date(selectedDate)).toLocaleString('default', { month: 'long', year: "numeric" })}</Text>
                    <CalendarProvider 
                        onDateChanged={selectDate} 
                        date={selectedDate}
                        style={{flex: 0}}
                    >
                        <WeekCalendar 
                            key={systemColors.background === lightColors.background ? "Light" : "Dark"} 
                            theme={{
                                calendarBackground: systemColors.background,
                                backgroundColor: systemColors.background,
                                dayTextColor: systemColors.textColor
                            }}
                            allowShadow={false}
                            calendarStyle={styles.shawdowBottom}
                            markingType={"multi-dot"}
                            markedDates={points}
                        /> 
                    </CalendarProvider>
                </Animated.View>
                <AssignmentsView secondaryCheck={flatListColor} themeMode={colorScheme} ref={flatListRef} updateSharedValue={updateSharedValue} assignments={organizedAssignments} />
            </View>
        </View>
    );
}

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
    pullTab: {
        height: 5,
        width: "30%",
        alignSelf: "center",
        marginVertical: 5,
        borderRadius: 5,
        justifyContent: "flex-end"
    },
    shadow: {
        shadowColor: '#000', 
        marginBottom: 3, 
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 4
    },
    shawdowBottom: {
        ...Platform.select({
            ios: {
              shadowColor: '#858F96',
              shadowOpacity: 0.25,
              shadowRadius: 10,
              shadowOffset: {height: 2, width: 0},
              zIndex: 99
            },
            android: {
              elevation: 3
            }
          })
    },
    calendarTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
    },
});

export default HomeScreen;

