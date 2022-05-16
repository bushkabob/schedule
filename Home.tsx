import { View, SafeAreaView, StyleSheet, Text, FlatList, Touchable } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { useSelector } from "react-redux";
import { RootState } from "./redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import GestureRecognizer from "react-native-swipe-gestures";
import { StoredAssignmentInfo } from "./redux/assingmentsSlice";

const HomeScreen = () => {
    const assignments = useSelector((state: RootState) => state.assignments)
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
        const organizedAssignments: { date: string, assignments: StoredAssignmentInfo[] }[] = [];
        console.log(assignments)
        assignments.forEach((assignment) => {
            const assignmentDate = new Date(assignment.date).toDateString();
            const assignmentIndex = organizedAssignments.findIndex((assignment) => assignment.date === assignmentDate);
            if (assignmentIndex === -1) {
                organizedAssignments.push({ date: assignmentDate, assignments: [assignment] })
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
        const firstDay = new Date(year, month, date)
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

interface DateAssignments {
    date: string,
    assignments: StoredAssignmentInfo[]
}
interface AssignmentsViewProps {
    data: DateAssignments[]
}

const AssignmentsView = (props: AssignmentsViewProps) => {
    const renderItem = (item: DateAssignments) => {
        console.log(props.data)
        return (
            <View style={{"paddingVertical": 10, "backgroundColor": "white", flexDirection: "row"}} >
                <View style={{flex:1}} >
                    <Text>{item.date}</Text>
                </View>
                <View style={{flexDirection: "column", flexWrap: "wrap", flex:3.5}}>
                    {item.assignments.map((assignment) => {
                        return (<View style={{flex:3}} key={assignment.id} >
                                    <Text>{assignment.name}</Text>
                                </View>)
                    })}
                </View>
            </View> 
        )
    }
    console.log (props.data)
    return (
        <View style={styles.assingmentView}>
            <FlatList ItemSeparatorComponent={()=><View style={styles.line}/>} keyExtractor={(item: DateAssignments, index: number) => {return item.date}} style={{height: "100%", width: "100%", paddingLeft: 10}} scrollEnabled data={props.data}  renderItem={({ item }) => renderItem(item)} />
        </View>
    )
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
    assingmentView: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        marginTop: 5,
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
    line: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: "100%",
    }
});

export default HomeScreen;

