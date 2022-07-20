import { View, StyleSheet, Text, VirtualizedList, Dimensions, ListRenderItem, Platform } from "react-native";
import { StatusBar } from 'expo-status-bar';
import {  useEffect, useRef, useState, useMemo, useCallback } from "react";
import AssignmentsView from "./AssignmentsView";
import { useSelector } from "react-redux";
import { RootState } from "./redux";
import { useTheme } from "./Theme/ThemeProvider";
import Animated, { Easing, runOnJS, SharedValue, useAnimatedGestureHandler, useAnimatedProps, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { PanGestureHandler, PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import WeekRow from "./WeekRow";
import { ExpandableCalendar, CalendarProvider, WeekCalendar } from "react-native-calendars";
import { lightColors } from "./Theme/colorThemes";

enum OpenState {
    OPENED = 1,
    CLOSED = 2,
    CHANGING = 3
}

const HomeScreen = () => {
    const initialDate = new Date().toDateString();
    const [currentDate, setCurrentDate] = useState(initialDate)
    const [selectedDate, setSelectedDate] = useState(initialDate)
    const systemColors = useTheme()
    const [openState, setOpenState] = useState(OpenState.CLOSED)

    const offsetVal = useSharedValue(0)

    const scrollHandler = useAnimatedScrollHandler((event) => {
        console.log(event.contentOffset.y)
        offsetVal.value = event.contentOffset.y
    })

    const animatedStyle = useAnimatedStyle(() => {
        return offsetVal.value > 0 ? {
            elevation: 99, shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: {height: 2, width: 0}, zIndex: 99
        } : {
            elevation: 1, shadowOpacity: 0.0, shadowRadius: 0, shadowOffset: {height: 2, width: 0}, zIndex: 1
        }
    }, [offsetVal])

    const date = new Date(currentDate)
    const day = date.getDay()
    const diff = date.getDate() - day
    const offset = date.getTimezoneOffset()
    const weekStart = new Date(date.setDate(diff))
    const weekStartString = weekStart.toISOString()
    const weekEndString = new Date(date.setDate(weekStart.getDate() + 6)).toISOString()
    const assignments = useSelector((state: RootState) => state.assignments.filter(assignment => !assignment.completed || assignment.date > weekStartString));
    const theme = useSelector((state: RootState) => state.colorTheme.colorThemes.filter((colorTheme) => colorTheme.name === state.colorTheme.selected)[0])

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
    
    // const gestureHandler = (event: GestureEvent<PanGestureHandlerEventPayload>) => {
    //     console.log(event.nativeEvent.translationY)
    // }

    const calendar = useRef<any>(null)
    const currentDateDate = new Date(currentDate)
    const selectedDateDate = new Date(selectedDate)
    selectedDateDate.setDate(selectedDateDate.getDate() - selectedDateDate.getDay())
    const dates = [selectedDateDate, new Date(selectedDate + 1), new Date(selectedDate + 2), new Date(selectedDate + 3), new Date(selectedDate + 4), new Date(selectedDate + 5), new Date(selectedDate + 6)]

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={[styles.calendarView, {backgroundColor: systemColors.background}]}>
                <Animated.View style={[{backgroundColor: systemColors.background, shadowColor: "rgb(133, 143, 150)"}, animatedStyle]}>
                    <CalendarProvider onDateChanged={(date) => {setSelectedDate(date)}} date={selectedDate} style={{flex: 0}}>
                        <WeekCalendar key={systemColors.background === lightColors.background ? "Light" : "Dark"} theme={{
                            calendarBackground: systemColors.background,
                            backgroundColor: systemColors.background,
                            dayTextColor: systemColors.textColor
                        }}
                        allowShadow={false}
                        calendarStyle={styles.shawdowBottom}
                        /> 
                    </CalendarProvider>
                </Animated.View>
                
                <AssignmentsView scrollHandler={scrollHandler} assignments={assignments} selectedDate={selectedDate} />
                {/* <Animated.View style={[animatedStyle, styles.shadow, {position: "absolute", zIndex: 1, top: 0, width: "100%", height: 100, backgroundColor: systemColors.background, borderBottomLeftRadius: 30, borderBottomRightRadius: 30}]} {...gestureHandler} >
                    <SwipeableCalendar 
                        activeIndicies={activeIndicies} 
                        selectedDate={new Date(selectedDate)} 
                        setSelecteDate={(date:Date)=>{setSelectDate(date.toDateString())}}  
                        forDate={new Date(currentDate)} 
                        decrement={decrementDate} 
                        increment={incrementDate} 
                    />
                    <Calendar openState={openState} selectedDate={selectedDate} currentDate={currentDate} setSelectedDate={setSelectedDate} />
                    <View style={{flex: 1}} />
                        <PanGestureHandler onGestureEvent={gestureHandler} hitSlop={{top: 5, bottom: 5, left: 50, right: 50}}>
                            <Animated.View>
                                <View style={[styles.pullTab, {backgroundColor: systemColors.systemGray}]} />
                            </Animated.View>
                        </PanGestureHandler>
                </Animated.View> */}
                {/* <View style={{height: 100}} /> */}
            </View>
        </View>
    );
}

interface CalendarProps {
    openState: OpenState
    selectedDate: string
    currentDate: string
    setSelectedDate: (date: string) => void
}

const Calendar = (props: CalendarProps) => {
    const theme = useSelector((state: RootState) => state.colorTheme.colorThemes.filter((colorTheme) => colorTheme.name === state.colorTheme.selected)[0])
    const flatListRef = useRef<VirtualizedList<(Date|null)[]>>(null)
    const selectedDate = new Date(props.selectedDate)
    const currentDate = new Date(props.currentDate)
    console.log(props.openState)
    
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

    useEffect(() => {
        if(props.openState===OpenState.CHANGING){
            flatListRef.current?.scrollToIndex({ animated: true, index: 11 })
        }
    })

    //create a function that accepts a date as input
    //it should run the getDates function on the date's month and year
    //it should also run it using the two months prior to and the two months after the date's month
    //it should return the list of dates
    const getMonthDates = (date: Date) => {
        const month = date.getMonth()
        const year = date.getFullYear()
        return [...getDates(month-2, year), ...getDates(month-1, year), ...getDates(month, year), ...getDates(month+1, year), ...getDates(month+2, year)]
    }

    const renderItem: ListRenderItem<(Date|null)[]> = ({ item }) => {
        const isSelected = item.map((date) => {
            return  date?.toDateString() === props.selectedDate
        })
        return renderCallback(item, isSelected)
    }

    const renderCallback = useCallback((item: (Date | null)[], isSelected: boolean[]) => {
        return (
            <WeekRow dates={item} isSelected={isSelected} currentDate={currentDate} activeIndicies={[[], [], [], [], [], [], []]} theme={theme} setSelectedDate={props.setSelectedDate} />
        )
    }, [])
    
    const keyExtractor = useCallback((_, index) => {return index.toString()}, [])
    const getItemLayout = useCallback((_, index) => { return { length: 59, offset: 59 * index, index: index} }, [])

    //pointerEvents={props.openState===OpenState.OPENED?"auto":"none"}
    const datesArray = getMonthDates(currentDate)
    return (
        <View style={styles.calendarView} >
            <View style={styles.calendarTitleRow} >
                <Text>Sun</Text>
                <Text>Mon</Text>
                <Text>Tue</Text>
                <Text>Wed</Text>
                <Text>Thu</Text>
                <Text>Fri</Text>
                <Text>Sat</Text>
            </View>
            {
            <VirtualizedList<(Date|null)[]>
                keyExtractor={keyExtractor}
                getItemLayout={getItemLayout}
                data={datesArray} 
                renderItem={renderItem} 
                getItemCount={()=>(Math.floor(datesArray.length/7)+1)} 
                getItem={(data, i)=>data.slice(i*7,i*7+7)} 
                showsVerticalScrollIndicator={false}
                initialScrollIndex={11}
                ref = {flatListRef}
            />
            }
        </View>
    )
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

