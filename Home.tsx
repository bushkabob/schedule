import { View, SafeAreaView, StyleSheet, Text, FlatList } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useSelector } from "react-redux";
import { RootState } from "./redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import GestureRecognizer from "react-native-swipe-gestures";
import { StoredAssignmentInfo } from "./redux/assingmentsSlice";
import AssignmentsView from "./AssignmentsView";

const HomeScreen = () => {
    //get all assignment from redux store that have not been completed or are not due yet
    const assignments = useSelector((state: RootState) => state.assignments.filter(assignment => !assignment.completed || assignment.date > new Date().toISOString()));
    const date = new Date().toDateString();
    const [currentDate, setCurrentDate] = useState(date)
    const [selectedDate, setSelectDate] = useState(date)

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

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <SafeAreaView style={styles.calendarView}>
               <SwipeableCalendar selectedDate={new Date(selectedDate)} setSelecteDate={(date:Date)=>{setSelectDate(date.toDateString())}}  forDate={new Date(currentDate)} decrement={decrementDate} increment={incrementDate} />
                <AssignmentsView data={organizeAssignments(assignments)} />
            </SafeAreaView>
        </View>
    );
}

interface swipeableCalendarProps {
    forDate: Date,
    increment: () => void,
    decrement: () => void,
    setSelecteDate: (date: Date) => void,
    selectedDate: Date,
}

const SwipeableCalendar = (props: swipeableCalendarProps) => {
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
    return (
        <View style={styles.container}>
            <View style={{width:"100%", backgroundColor: "white"}}>
                <Text style={{alignSelf:"center", paddingTop: 10}}>{month + ", " + year}</Text>
                <GestureRecognizer onSwipeRight={props.decrement} onSwipeLeft={props.increment} >
                    <View style={styles.calendarTitleRow}>
                        <TouchableOpacity onPress={props.decrement}>
                            <Ionicons name="ios-arrow-back" size={16} />
                        </TouchableOpacity>
                            {dates.map(([day, date, selected]) => (
                                <View key={day}>
                                    <Text key={day} style={styles.calendarTitle}>{day}</Text>
                                    <Text style={[styles.calendarTitle, {color:selected?"blue":"black"}]} key={date.getDate()}>{date.getDate()}</Text>
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
        paddingVertical: 10,
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

