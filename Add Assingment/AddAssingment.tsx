import { View, StyleSheet, Button, GestureResponderEvent, Alert, Text } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { TableView, Cell, Separator } from 'react-native-tableview-simple';
import { useLayoutEffect, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { SelectScreenProps } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux';
import MaskedView from '@react-native-masked-view/masked-view';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { addAssignment, StoredAssignmentInfo, updateAssignment } from '../redux/assingmentsSlice'
import { AddAssignmentRouteProps } from '../types';
import { AddAssignmentRouteProps as AddAssignmentRouteProps2 } from './types';
import { useTheme } from '../Theme/ThemeProvider';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

enum pickerState {
    none,
    date,
    time
}

export enum selectType {
    class,
    assignmentType
}

interface SaveButtonProps {
    onPress: (event: GestureResponderEvent) => void,
    assignment: StoredAssignmentInfo | undefined,
    assingmentName: string,
    classOptions: string[],
    typeOptions: string[]
}

const SaveButton = (props: SaveButtonProps) => {
    return (
        <Button 
            title={typeof props.assignment !== "undefined" ? 'Update' : 'Add'} 
            onPress={props.onPress} 
            disabled={(props.assingmentName !== undefined && props.assingmentName === "") || props.assingmentName === undefined || props.classOptions.length === 0 || props.typeOptions.length === 0}
        />
    )
}

const noOptionsAlert = (category: string) => {
    return (
        Alert.alert("Error", "There is no " + category + " data. Please add some to add an assingment")
    )
}

const AddAssingment = () => {
    //Extract the assignment from the route
    const route = useRoute<AddAssignmentRouteProps | AddAssignmentRouteProps2>();
    const assignment = "assignment" in route.params ? route.params.assignment : undefined;

    const dispatch = useDispatch()
    const initialDate = new Date(Date.now())
    initialDate.setHours(23, 59, 59)
    const classOptions = useSelector((state: RootState) => state.classes);
    const typeOptions = useSelector((state: RootState) => state.assignmentTypes);
    const [assignmentName, setAssingmentName] = useState(typeof assignment !== "undefined" ? assignment.name : "");
    const [selectedClass, setSelectedClass] = useState(typeof assignment !== "undefined" ? assignment.class : classOptions[0]);
    const [selectedType, setType] = useState(typeof assignment !== "undefined" ? assignment.type : typeOptions[0]);
    const [selectedDay, setSelectedDay] = useState(typeof assignment !== "undefined" ? new Date(assignment.date) : initialDate);
    const [datePickerVisible, setDatePickerVisible] = useState(pickerState.none);
    const navigation = useNavigation<SelectScreenProps>()
    const systemColors = useTheme()
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: ()=><SaveButton classOptions={classOptions} typeOptions={typeOptions} assingmentName={assignmentName} assignment={assignment} onPress={onPress} />,
            headerBackVisible: typeof assignment !== "undefined",
            headerLeft: typeof assignment !== "undefined" ? undefined : ()=><Button title='Cancel' onPress={() => navigation.goBack()} />
        })
    }, [selectedClass, assignmentName, selectedType, selectedClass, selectedDay])

    useFocusEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if(route.params.selectedData && route.params.selectedData.category === "Select Type"){
                setType(route.params.selectedData.selectedString)
            }
            if(route.params.selectedData && route.params.selectedData.category === "Select Class"){
                setSelectedClass(route.params.selectedData.selectedString)
            }
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    })

    const onPress = () => {
        typeof assignment !== "undefined" ? updateAssignmentData(assignment.id, assignment.completed) : saveAssignmentData()
        navigation.goBack()
    }

    const saveAssignmentData = () => {
        dispatch(addAssignment({ assignment: { class: selectedClass, name: assignmentName, type: selectedType, date: selectedDay.toISOString(), completed: false } }))
    }

    const updateAssignmentData = (assignmentId: string, completed: boolean) => {
        dispatch(updateAssignment({ assignment: { class: selectedClass, name: assignmentName, type: selectedType, date: selectedDay.toISOString(), completed:  completed}, id: assignmentId }))
    }

    const onDateChange = (event: DateTimePickerEvent, date?: Date | undefined) => {
        const newDate = date ? date : new Date(selectedDay);
        const oldDate = new Date(selectedDay);
        //combine the date of newDate and the time of selectedDay into one date object
        const newDateTime = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), oldDate.getHours(), oldDate.getMinutes(), oldDate.getSeconds());
        setSelectedDay(newDateTime);
    }

    const onTimeChange = (event: DateTimePickerEvent, date?: Date | undefined) => {
        const newDate = date ? date : new Date(selectedDay);
        const oldDate = new Date(selectedDay);
        //combine the date of newDate and the time of selectedDay into one date object
        const newDateTime = new Date(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate(), newDate.getHours(), newDate.getMinutes(), newDate.getSeconds());
        setSelectedDay(newDateTime);
    }
    
    const timeHeight = useSharedValue(0)
    const timeStyle = useAnimatedStyle(() => {
        return {height: withTiming(timeHeight.value, {duration: 100, easing: Easing.linear})}
    })

    const dateHeight = useSharedValue(0)
    const dateStyle = useAnimatedStyle(() => {
        return {height: withTiming(dateHeight.value, {duration: 100, easing: Easing.linear})}
    })

    return(
        <View style={styles.container}>
            <ScrollView style={styles.container} scrollEnabled>
                <TableView style={styles.tableView}>
                    <Cell cellContentView={
                        <TextInput defaultValue={assignmentName} placeholder='Assignment Name' allowFontScaling style={[styles.textInput, {color: systemColors.textColor}]} onChangeText={(text)=>(setAssingmentName(text))} />
                    } />
                    <Separator />
                    <Cell 
                        cellStyle="RightDetail" 
                        title="Class" 
                        detail={selectedClass} 
                        accessory="DisclosureIndicator" 
                        onPress={
                            ()=>
                            classOptions.length>0?
                            navigation.navigate("SelectListOption", { name: "Select Class", options: classOptions, selected: selectedClass })
                            :
                             noOptionsAlert('class')
                        }/>
                    <Separator/>
                    <Cell 
                        cellStyle="RightDetail" 
                        title="Assignment Type" 
                        detail={selectedType} 
                        accessory="DisclosureIndicator" 
                        onPress={
                            ()=>
                                typeOptions.length>0?
                                navigation.navigate("SelectListOption", { name: "Select Type", options: typeOptions, selected: selectedType })
                                :
                                noOptionsAlert('assignment type')
                        }/>
                    <Separator />
                    <Cell 
                        cellStyle="RightDetail" 
                        title="Due Date" 
                        detail={new Date(selectedDay).toLocaleDateString()} 
                        onPress={() => {
                            dateHeight.value === 0 ?
                            (dateHeight.value=200, timeHeight.value = 0):
                            (dateHeight.value=0)
                        }} 
                    />
                    {/* {
                        datePickerVisible === pickerState.date &&
                        <Cell cellContentView={
                            <View style={styles.container}>
                                <DateTimePicker mode='date' display='spinner' value={new Date(selectedDay)} onChange={onDateChange} />
                            </View>
                        } />
                    } */}
                    <MaskedView maskElement={<View style={{flex: 1, backgroundColor: 'black'}} />}>
                        <Animated.View style={[{backgroundColor: "blue"}, dateStyle]}>
                            <Separator />
                            <Cell cellContentView={
                                <View style={styles.container}>
                                    <DateTimePicker mode='date' display='spinner' value={new Date(selectedDay)} onChange={onDateChange} />
                                </View>
                            }
                            />
                            <Separator />
                        </Animated.View>
                    </MaskedView>
                    <Separator />
                    <Cell 
                        cellStyle="RightDetail" 
                        title="Time " 
                        detail={new Date(selectedDay).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                        onPress={()=>{
                            timeHeight.value === 0 ?
                            (timeHeight.value=200, dateHeight.value = 0):
                            (timeHeight.value=0)
                        }} 
                    />
                    <MaskedView maskElement={<View style={{flex: 1, backgroundColor: 'black'}} />}>
                        <Animated.View style={[{backgroundColor: "blue"}, timeStyle]}>
                            <Separator />
                            <Cell cellContentView={
                                <View style={styles.container}>
                                    <DateTimePicker mode='time' display='spinner' value={new Date(selectedDay)} onChange={onTimeChange} />
                                </View>
                            }
                            />
                            <Separator />
                        </Animated.View>
                    </MaskedView>
                </TableView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%"
    },
    tableView: {
        flex: 1,
        width: "100%",
    },
    textInput: {
        width: "100%",
        height: "100%",
        fontSize: 16
    }
});

export default AddAssingment