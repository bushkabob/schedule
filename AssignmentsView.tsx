import { View, Text, FlatList, StyleSheet } from "react-native";
import { useState, useEffect, useRef } from "react";
import { updateAssignmentCompleted, StoredAssignmentInfo } from "./redux/assingmentsSlice"
import { useDispatch, useSelector } from "react-redux";
import { Accelerometer } from 'expo-sensors';
import { Subscription } from "expo-sensors/build/Pedometer";
import { Swipeable } from "react-native-gesture-handler";
import Dialog from "react-native-dialog";
import SwipeableAssignmentCell from "./AssignmentViewCell";
import ColorIndicator from "./ColorIndicator";
import { RootState } from "./redux";

interface DateAssignments {
    date: string,
    isFirstofMonth: boolean,
    assignments: StoredAssignmentInfo[]
}

interface AssignmentViewProps {
    selectedDate: string
    assignments: StoredAssignmentInfo[]
}

//Main Screen
const AssignmentsView = (props: AssignmentViewProps) => {
    const dispatch = useDispatch();
    const [oldAssignment, setOldAssignment] = useState<StoredAssignmentInfo>()
    const [subscription, setSubscription] = useState<Subscription|null>(null);
    const swipeableRefs = useRef<{[key:string]:Swipeable|null}>({})
    const [prevOpenedRow, setPrevOpenedRow] = useState<Swipeable | null>(null)
    const [dialogVisible, setDialogVisible] = useState(false)

    //Class colors
    const theme = useSelector((state: RootState) => state.colorTheme.colorThemes.filter((colorTheme) => colorTheme.name === state.colorTheme.selected)[0])
    const classes = useSelector((state: RootState) => state.classes)

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
        if (prevOpenedRow && prevOpenedRow !== swipeableRefs.current[id]) {
            console.log("close")
            prevOpenedRow.close();
        }
        setPrevOpenedRow(swipeableRefs.current[id]);
    }

    //end of swipeable code

    //Renders a cell for each day, if the day is the first of the month, it will render a header for the month
    const renderItem = (item: DateAssignments) => {
        //Getting a single list of clases for the day
        const usedClasses = item.assignments.reduce((prev, assignment) => {!prev.includes(assignment.class) && prev.push(assignment.class); return prev}, [] as string[])
        const colors = usedClasses.map((className) => classes.findIndex((classInfo) => classInfo === className))
        return (
            <View style={{marginTop: 10}} >
                <View>
                    {item.isFirstofMonth && 
                        <View style={[{backgroundColor: "white", marginBottom: 10}, styles.shadow]}> 
                            <Text style={{marginHorizontal: 10, fontSize: 30, fontWeight: "bold", paddingVertical:5}}>{item.date.split(" ")[1]}</Text> 
                        </View>
                    }
                    <View style={[{paddingVertical: 10, backgroundColor: "white"}, styles.shadow]} >
                        <View style={{backgroundColor: "white", borderRadius: 30, alignItems: "center", flexDirection: "row", flexGrow: 1, height: 40}}>
                            <Text style={{fontSize:20, marginHorizontal: 20}} >{item.date.split(" ")[2]}</Text>
                            <View style={{flexDirection: "row", flexGrow: 1, justifyContent: "flex-end", marginHorizontal: 10}} >
                                {colors.map((color) => <ColorIndicator key={color} style={{marginHorizontal: 2}} color={theme.colors[color - Math.floor(color/theme.colors.length)]} />)}
                            </View>
                        </View>
                        <View style={{flexDirection: "column", flexWrap: "wrap", flex:1}}>
                            {item.assignments.map((assignment) => {
                                return(
                                    <SwipeableAssignmentCell 
                                        setPrevOpenRow={setPrevOpenedRow}
                                        key={assignment.id}
                                        assignment={assignment} 
                                        setOldAssignment={setOldAssignment} 
                                        updateSwipeableRef={updateSwipeableRef}
                                        closeRow={closeRow}
                                        color={theme.colors[classes.findIndex((classInfo) => classInfo === assignment.class)]}
                                    />
                                )
                            })}
                        </View>
                    </View>
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
            <FlatList 
                keyExtractor={(item: DateAssignments) => {return item.date}} 
                style={{height: "100%", width: "100%"}}
                scrollEnabled 
                data={organizeAssignments(props.assignments)}  
                renderItem={({ item }) => renderItem(item)}
                ListFooterComponent={() => <View style={{height: 50}} />}
            />
        </View>
    )
}

//Assignment Cell Content w/ swipeable functionality

export default AssignmentsView;

const styles = StyleSheet.create({
    assingmentView: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        backgroundColor: "white",
    },
    line: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: "100%",
    },
    shadow: {
        // shadowColor: '#000', 
        // margin: 3, 
        // shadowOffset: { width: 0, height: 1 }, 
        // shadowOpacity: 0.8, 
        // shadowRadius: 2,
        // borderRadius: 30
    }
});