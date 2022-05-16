import { View, StyleSheet, Button } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { TableView, Cell, Separator } from 'react-native-tableview-simple';
import { SyntheticEvent, useLayoutEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AddAssignmentRouteProps, SelectScreenProps } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux';

import DateTimePicker from '@react-native-community/datetimepicker';
import { addAssignment } from '../redux/assingmentsSlice'

enum pickerState {
    none,
    date,
    time
}

export enum selectType {
    class,
    assignmentType
}

const AddAssingment = () => {

    const route = useRoute<AddAssignmentRouteProps>();
    const dispatch = useDispatch()
    //const initialAssignmentType = route.params.selectedAssigmentType ? route.params.selectedAssigmentType : 
    const initialDate = new Date(Date.now())
    initialDate.setHours(23, 59, 59)
    const classOptions = useSelector((state: RootState) => state.classes);
    const typeOptions = useSelector((state: RootState) => state.assignmentTypes);
    const [assignmentName, setAssingmentName] = useState("");
    const [selectedClass, setSelectedClass] = useState(classOptions[0]);
    const [selectedType, setType] = useState(typeOptions[0])
    const [selectedDay, setSelectedDay] = useState(initialDate);
    const [datePickerVisible, setDatePickerVisible] = useState(pickerState.none);

    const navigation = useNavigation<SelectScreenProps>()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: ()=><Button title='Add' onPress={() => saveAssignment()} />,
            headerBackVisible: false,
            headerLeft: ()=><Button title='Cancel' onPress={() => navigation.goBack()} />
        })
    }, [selectedClass, assignmentName, selectedType, selectedClass])

    const saveAssignment = () => {
        dispatch(addAssignment({ assignment: { class: selectedClass, name: assignmentName, type: selectedType, date: selectedDay.toISOString() }}))
        navigation.goBack()
    }

    const onDateChange = (_: SyntheticEvent<Readonly<{ timestamp: number; }>, Event>, date: Date | undefined) => {
        const newDate = date ? date : new Date(selectedDay);
        const oldDate = new Date(selectedDay);
        //combine the date of newDate and the time of selectedDay into one date object
        const newDateTime = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), oldDate.getHours(), oldDate.getMinutes(), oldDate.getSeconds());
        setSelectedDay(newDateTime);
    }

    const onTimeChange = (_: SyntheticEvent<Readonly<{ timestamp: number; }>, Event>, date: Date | undefined) => {
        const newDate = date ? date : new Date(selectedDay);
        const oldDate = new Date(selectedDay);
        //combine the date of newDate and the time of selectedDay into one date object
        const newDateTime = new Date(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate(), newDate.getHours(), newDate.getMinutes(), newDate.getSeconds());
        setSelectedDay(newDateTime);
    }

    return(
        <View style={styles.container}>
            <ScrollView style={styles.container} scrollEnabled>
                <TableView style={styles.tableView}>
                    <Cell cellContentView={
                        <TextInput placeholder='Assignment Name' allowFontScaling style={styles.textInput} onChangeText={(text)=>(setAssingmentName(text))} />
                    } />
                    <Separator />
                    <Cell cellStyle="RightDetail" title="Class" detail={selectedClass} accessory="DisclosureIndicator" onPress={()=>navigation.navigate("SelectListOption", { options: classOptions, selected: selectedClass, updateSelected: (value: string) => setSelectedClass(value)})}/>
                    <Separator/>
                    <Cell cellStyle="RightDetail" title="Assignment Type" detail={selectedType} accessory="DisclosureIndicator" onPress={()=>navigation.navigate("SelectListOption", { options: typeOptions, selected: selectedType, updateSelected: (value: string) => setType(value)})}/>
                    <Separator />
                    <Cell cellStyle="RightDetail" title="Due Date" detail={new Date(selectedDay).toLocaleDateString()} onPress={()=>datePickerVisible===pickerState.date?setDatePickerVisible(pickerState.none):setDatePickerVisible(pickerState.date)} />
                    <Separator isHidden={(datePickerVisible === pickerState.time)} />
                    {
                        datePickerVisible === pickerState.date &&
                        <Cell cellContentView={
                            <View style={styles.container}>
                                <DateTimePicker mode='date' display='spinner' value={new Date(selectedDay)} onChange={onDateChange} />
                            </View>
                        } />
                    }
                    <Separator isHidden={!(datePickerVisible === pickerState.date)} />
                    <Separator isHidden={!(datePickerVisible === pickerState.time)} />
                    <Cell cellStyle="RightDetail" title="Time " detail={new Date(selectedDay).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} onPress={()=>datePickerVisible===pickerState.time?setDatePickerVisible(pickerState.none):setDatePickerVisible(pickerState.time)} />
                    <Separator isHidden={!(datePickerVisible === pickerState.time)} />
                    {
                        datePickerVisible === pickerState.time &&
                        <Cell cellContentView={
                            <View style={styles.container}>
                                <DateTimePicker mode='time' display='spinner' value={new Date(selectedDay)} onChange={onTimeChange} />
                            </View>
                        } />
                    }
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