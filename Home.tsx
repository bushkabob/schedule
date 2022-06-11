import { View, StyleSheet, Appearance } from "react-native";
import { StatusBar } from 'expo-status-bar';
import {  useState } from "react";
import AssignmentsView from "./AssignmentsView";
import { useSelector } from "react-redux";
import { RootState } from "./redux";
import { useTheme } from "./Theme/ThemeProvider";
import SwipeableCalendar from "./SwipeableCalendar";

const HomeScreen = () => {
    const initialDate = new Date().toDateString();
    const [currentDate, setCurrentDate] = useState(initialDate)
    const [selectedDate, setSelectDate] = useState(initialDate)
    const isDark = Appearance.getColorScheme() === "dark";
    console.log(isDark)

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
});

export default HomeScreen;

