import { View, SafeAreaView, StyleSheet, Text } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity } from "react-native-gesture-handler";
import {  useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import GestureRecognizer from "react-native-swipe-gestures";
import AssignmentsView from "./AssignmentsView";
import { useSelector } from "react-redux";
import { RootState } from "./redux";

const HomeScreen = () => {
    const initialDate = new Date().toDateString();
    const [currentDate, setCurrentDate] = useState(initialDate)
    const [selectedDate, setSelectDate] = useState(initialDate)

    const date = new Date(currentDate)
    const day = date.getDay()
    const diff = date.getDate() - day
    const offset = date.getTimezoneOffset()
    const weekStart = new Date(date.setDate(diff))
    const weekStartString = weekStart.toISOString()
    const weekEndString = new Date(date.setDate(weekStart.getDate() + 6)).toISOString()
    const assignments = useSelector((state: RootState) => state.assignments.filter(assignment => !assignment.completed || assignment.date > weekStartString));
    //create an object that contains that has the dates for the week in the format of "yyyy-mm-dd" as the keys and empty arrays as the values
    const weekDates = Array.from(Array(7).keys()).reduce((acc, _, i) => {
        const date = new Date(weekStartString)
        date.setDate(date.getDate() + i)
        const dateString = date.toISOString().slice(0, 10)
        return { ...acc, [dateString]: [] }
    }, {} as { [key: string]: string[] })

    console.log(assignments)

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
    //end color indictors
    const incrementDate = () => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() + 7);
            return newDate.toDateString();
        })
    }

    const decrementDate = () => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            newDate.setDate(newDate.getDate() - 7);
            return newDate.toDateString();
        })
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.calendarView}>
               <SwipeableCalendar activeIndicies={activeIndicies} selectedDate={new Date(selectedDate)} setSelecteDate={(date:Date)=>{setSelectDate(date.toDateString())}}  forDate={new Date(currentDate)} decrement={decrementDate} increment={incrementDate} />
                <AssignmentsView assignments={assignments} selectedDate={currentDate} />
            </View>
        </View>
    );
}

interface swipeableCalendarProps {
    forDate: Date,
    increment: () => void,
    decrement: () => void,
    setSelecteDate: (date: Date) => void,
    selectedDate: Date,
    activeIndicies: number[][]
}

const SwipeableCalendar = (props: swipeableCalendarProps) => {
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

    const getColor = (colorIndex: number) => {
        return theme.colors[colorIndex - Math.floor(colorIndex/theme.colors.length)]
    }
    
    const circleHeight = 5;
    return (
        <View style={styles.container}>
            <View style={{width:"100%", backgroundColor: "white"}}>
                <Text style={{alignSelf:"center", paddingTop: 10}}>{month + ", " + year}</Text>
                <GestureRecognizer onSwipeRight={props.decrement} onSwipeLeft={props.increment} >
                    <View style={styles.calendarTitleRow}>
                        <TouchableOpacity onPress={props.decrement}>
                            <Ionicons name="ios-arrow-back" size={16} />
                        </TouchableOpacity>
                            {dates.map(([day, date, selected], index) => (
                                <View key={day}>
                                    <View style={{flexGrow: 1}}>
                                        <Text key={day} style={[styles.calendarTitle]}>{day}</Text>
                                        <Text style={[styles.calendarTitle, {color:selected?"blue":"black", marginTop:10, marginBottom: 5}]} key={date.getDate()}>{date.getDate()}</Text>
                                    </View>
                                    <View>
                                        <View style={{justifyContent: "center", alignItems: "center"}}>
                                                <View style={{flexDirection: "row", height: circleHeight, justifyContent: "center", margin: 1, width: circleHeight*6}}>
                                                    {props.activeIndicies[index].slice(0,4).map((colorIndex) => {
                                                        return <View key={colorIndex} style={{height: circleHeight, width: circleHeight, marginHorizontal: 1, borderRadius: 60, backgroundColor: getColor(colorIndex)}} />
                                                    })
                                                    }
                                                </View>
                                                <View style={{flexDirection: "row", height: circleHeight, margin: 1, justifyContent: "center", width: circleHeight*6}}>
                                                    {props.activeIndicies[index].slice(4,8).map((colorIndex) => {
                                                        return <View key={colorIndex} style={{height: circleHeight, width: circleHeight, marginHorizontal: 1, borderRadius: 60, backgroundColor: getColor(colorIndex)}} />
                                                    })
                                                    }
                                                </View>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        <TouchableOpacity onPress={props.increment} >
                            <Ionicons name="ios-arrow-forward" size={16} />
                        </TouchableOpacity>
                    </View>
                </GestureRecognizer>
            </View>
        </View>
    );
}

/*const Calendar = () => {
    const [selectedDate, updateSelectedDate] = useState(new Date(Date.now()))

    //make a list

    //create a function that accepts a month and year as input
    //it should make a list of date objects within that month as date objects, 
    //it should add one null to the beginning of the list for each day removed the first day of the month is from the start of the week
    //it should also add null to the end of the list if the last day of the month is not a full week
    //it should fill in the extra spaces with nulls
    //it should return the list of dates
    //sunday is 0, monday is 1, etc.
    const getDates = (month: number, year: number) => {
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();
        const dates = [];
        for (let i = 0; i < firstDay; i++) {
            dates.push(null);
        }
        dates.push()
        for (let i = 1; i <= lastDay; i++) {
            dates.push(new Date(year, month, i));
        }
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const lastDayOfMonthDay = lastDayOfMonth.getDay();
        if (lastDayOfMonthDay !== 6) {
            for (let i = 0; i < 6 - lastDayOfMonthDay; i++) {
                dates.push(null);
            }
        }
        return dates;
    }

    //create a function that accepts a date as input
    //it should run the getDates function on the date's month and year
    //it should also run it using the two months prior to and the two months after the date's month
    //it should return the list of dates
    const getMonthDates = (date: Date) => {
        const month = date.getMonth()
        const year = date.getFullYear()
        return [...getDates(month-2, year), ...getDates(month-1, year), ...getDates(month, year), ...getDates(month+1, year), ...getDates(month+2, year)]
    }

    const renderItem = (item: (Date|null)[]) => {
        console.log(item)
        return (
            <View style={styles.calendarTitleRow}>
                <Text>{item[0]?item[0].getDate():""}</Text>
                <Text>{item[1]?item[1].getDate():""}</Text>
                <Text>{item[2]?item[2].getDate():""}</Text>
                <Text>{item[3]?item[3].getDate():""}</Text>
                <Text>{item[4]?item[4].getDate():""}</Text>
                <Text>{item[5]?item[5].getDate():""}</Text>
                <Text>{item[6]?item[6].getDate():""}</Text>
            </View>
        )
    }

    const datesArray = getMonthDates(selectedDate)

    return (
        <View style={styles.calendarView}>
            <View style={styles.calendarTitleRow} >
                <Text>Sun</Text>
                <Text>Mon</Text>
                <Text>Tue</Text>
                <Text>Wed</Text>
                <Text>Thu</Text>
                <Text>Fri</Text>
                <Text>Sat</Text>
            </View>
            <VirtualizedList<(Date|null)[]> keyExtractor={(_, index) => {return index.toString()}} data={datesArray} renderItem={({ item }) => renderItem(item)} getItemCount={()=>(Math.floor(datesArray.length/7)+1)} getItem={(data, i)=>data.slice(i*7,i*7+7)} />
        </View>
    )
}*/

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

export default HomeScreen;

