import { View, Text, FlatList, StyleSheet, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import { updateAssignmentCompleted, StoredAssignmentInfo, removeAssignment } from "./redux/assingmentsSlice"
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch, useSelector } from "react-redux";
import { Accelerometer } from 'expo-sensors';
import { Subscription } from "expo-sensors/build/Pedometer";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AddAssigmentProps } from "./types";
import { RootState } from "./redux";
import Dialog from "react-native-dialog";
interface DateAssignments {
    date: string,
    isFirstofMonth: boolean,
    assignments: StoredAssignmentInfo[]
}

interface AssignmentViewProps {
    selectedDate: string
}

const AssignmentsView = (props: AssignmentViewProps) => {
    const dispatch = useDispatch();
    const [oldAssignment, setOldAssignment] = useState<StoredAssignmentInfo>()
    const [subscription, setSubscription] = useState<Subscription|null>(null);
    const swipeableRefs = useRef<{[key:string]:Swipeable|null}>({})
    const [prevOpenedRow, setPrevOpenedRow] = useState<Swipeable | null>(null)
    const [dialogVisible, setDialogVisible] = useState(false)

    //Determining the week start for the selected date
    const date = new Date(props.selectedDate)
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1)
    const weekStartString = new Date(date.setDate(diff)).toISOString()

    const assignments = useSelector((state: RootState) => state.assignments.filter(assignment => !assignment.completed || assignment.date > weekStartString));

    

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

    //Accelerometer code
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });

    useEffect(() => {
        const acceleration = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
        if (acceleration > 3) {
            console.log("shake")
            handleShake();
        }
    }, [data])

    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);

    const _subscribe = () => {
        setSubscription(
            Accelerometer.addListener(accelerometerData => {
                setData(accelerometerData);
            })
        );
        Accelerometer.setUpdateInterval(100);
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    //undo last change if the user shakes their device
    const handleShake = () => {
        if (typeof oldAssignment !== "undefined") {
            setDialogVisible(true)
        }
    }

    //end of accelerometer code

    //start of dialog code
    
    const handlePress = (shouldDelete: boolean) => {
        if (typeof oldAssignment !== "undefined" && shouldDelete) {
            dispatch(updateAssignmentCompleted({id: oldAssignment.id, completed: !oldAssignment.completed}))
            setOldAssignment(undefined)
        }
        setDialogVisible(false);
    };

    //end of dialog code

    //start of swipeable code - prevents more than one row from being open at a time

    const updateSwipeableRef = (id: string, ref: Swipeable|null) => {
        swipeableRefs.current[id] = ref
    }

    const closeRow = (id: string) => {
        console.log(swipeableRefs)
        console.log(prevOpenedRow)
        if (prevOpenedRow && prevOpenedRow !== swipeableRefs.current[id]) {
            console.log("close")
            prevOpenedRow.close();
        }
        setPrevOpenedRow(swipeableRefs.current[id]);
    }

    //end of swipeable code

    //Renders a cell for each day, if the day is the first of the month, it will render a header for the month
    const renderItem = (item: DateAssignments) => {
        return (
            <View>
                {item.isFirstofMonth && <Text style={{paddingBottom: 5, fontSize: 30, fontWeight: "bold"}}>{item.date.split(" ")[1]}</Text>}
                <View style={{"paddingVertical": 10, flexDirection: "row"}} >
                    <View style={{flex:1, alignItems: "center"}} >
                        <View style={{backgroundColor: "white", borderColor: "black", borderWidth: 1, borderRadius: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", aspectRatio: 1, width: "50%"}}>
                            <Text style={{fontSize:20}} >{item.date.split(" ")[2]}</Text>
                        </View>
                    </View>
                    <AssignmentCell data={item.assignments} setOldAssignment={setOldAssignment} updateSwipeableRef={updateSwipeableRef} closeRow={closeRow} />
                </View> 
            </View>
        )
    }

    return (
        <View style={styles.assingmentView}>
            <Dialog.Container visible={dialogVisible} onBackdropPress={()=>handlePress(false)} >
                <Dialog.Title>Undo</Dialog.Title>
                <Dialog.Description>
                    Do you want to undo the last "check off" change?
                </Dialog.Description>
                <Dialog.Button bold label="Cancel" onPress={()=>handlePress(false)} />
                <Dialog.Button label="Undo" onPress={()=>handlePress(true)} />
            </Dialog.Container>
            <FlatList ItemSeparatorComponent={()=><View style={styles.line}/>} keyExtractor={(item: DateAssignments) => {return item.date}} style={{height: "100%", width: "100%", paddingLeft: 10}} scrollEnabled data={organizeAssignments(assignments)}  renderItem={({ item }) => renderItem(item)} />
        </View>
    )
}

interface AssignmentCellProps {
    data: StoredAssignmentInfo[]
    setOldAssignment: (assignment: StoredAssignmentInfo) => void
    updateSwipeableRef: (id: string, ref: Swipeable|null) => void
    closeRow: (id: string) => void
}

//Assingment cell that renders a list of assignments for a day
const AssignmentCell = (props: AssignmentCellProps) => {
    return (
        <View style={{flexDirection: "column", flexWrap: "wrap", flex:3.5}}>
            {props.data.map((assignment) => {
                return(
                    <SwipeableAssignmentCell 
                        key={assignment.id}
                        assignment={assignment} 
                        setOldAssignment={props.setOldAssignment} 
                        updateSwipeableRef={props.updateSwipeableRef}
                        closeRow={props.closeRow}
                    />
                )
            })}
        </View>
    )
}

interface SwipeableAssignmentCellProps {
    assignment: StoredAssignmentInfo
    setOldAssignment: (assignment: StoredAssignmentInfo) => void
    updateSwipeableRef: (id: string, ref: Swipeable|null) => void
    closeRow: (id: string) => void
}

//Swipeable assignment cell that renders a single assignment
const SwipeableAssignmentCell = (props: SwipeableAssignmentCellProps) => {
    const isOverdue = new Date(props.assignment.date) < new Date() && !props.assignment.completed;
    const dispatch = useDispatch()
    const navigation = useNavigation<AddAssigmentProps>()

    const RightAction = (_: Animated.AnimatedInterpolation, dragX: Animated.AnimatedInterpolation, assignment: StoredAssignmentInfo) => {
        //Animations for slide buttons
        const scaleDelete = dragX.interpolate({
            inputRange: [-40,0], 
            outputRange: [1,0],
            extrapolate: "clamp",
        });
        const scaleEdit = dragX.interpolate({
            inputRange: [-90,0], 
            outputRange: [1,0],
            extrapolate: "clamp",
        });

        return (
            <View style={{flexDirection: "row", marginLeft: 3}}>
                <Animated.View style={[{borderRadius: 30, backgroundColor: "gray", height: "100%", aspectRatio: 1, justifyContent: "center", alignItems: "center", marginRight: 3}, {transform: [{scale: scaleEdit}]}]}>
                    <Ionicons name='ellipsis-horizontal-circle-outline' color={"white"} size={24} onPress={()=>navigation.navigate("AddAssignment",{ assignment: assignment })} />
                </Animated.View>
                <Animated.View style={[{borderRadius: 30, backgroundColor: "red", height: "100%", aspectRatio: 1, justifyContent: "center", alignItems: "center"}, {transform: [{scale: scaleDelete}]}]}>
                    <Ionicons 
                        name='trash-outline' 
                        color={"white"} 
                        size={24} 
                        onPress={()=>dispatch(removeAssignment({ id: assignment.id }))} 
                    />
                </Animated.View>
            </View>
        );
    }

    return (
        <View style={{width:"100%", paddingRight: 10, paddingBottom: 5}} key={props.assignment.id} >
            <Swipeable 
                key={props.assignment.id} 
                ref={ref => props.updateSwipeableRef(props.assignment.id,ref)} 
                onSwipeableOpen={()=>props.closeRow(props.assignment.id)} 
                containerStyle={{}} 
                renderRightActions={(progress, dragX) => RightAction(progress, dragX, props.assignment)}
            >
                <View style={{padding: 10, flexDirection:"row", justifyContent:"space-between", backgroundColor: "white", borderRadius: 10, shadowColor: '#000', margin: 3, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, shadowRadius: 2, elevation: 5}} >
                    <View style={{justifyContent: "center"}}>
                        <Text style={isOverdue?{color:"red"}:{}}>
                            {props.assignment.name + " - " + props.assignment.class}
                        </Text>
                    </View>
                    <BouncyCheckbox 
                        isChecked={props.assignment.completed} 
                        disableBuiltInState  style={{flexDirection: "row-reverse"}} 
                        onPress={() => (props.setOldAssignment({...props.assignment, completed: !props.assignment.completed}), dispatch(updateAssignmentCompleted({id: props.assignment.id, completed: !props.assignment.completed})))} 
                    />
                </View>
            </Swipeable>
        </View>
    )
}

export default AssignmentsView;

const styles = StyleSheet.create({
    assingmentView: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        marginTop: 5,
    },
    line: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: "100%",
    }
});