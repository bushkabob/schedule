import { View, Text, FlatList, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { updateAssignmentCompleted, StoredAssignmentInfo } from "./redux/assingmentsSlice"
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch } from "react-redux";
import { Accelerometer } from 'expo-sensors';
import { Subscription } from "expo-sensors/build/Pedometer";

interface DateAssignments {
    date: string,
    isFirstofMonth: boolean,
    assignments: StoredAssignmentInfo[]
}
interface AssignmentsViewProps {
    data: DateAssignments[]
}

const AssignmentsView = (props: AssignmentsViewProps) => {
    const dispatch = useDispatch();
    const [oldAssignment, setOldAssignment] = useState<StoredAssignmentInfo>()
    const [subscription, setSubscription] = useState<Subscription|null>(null);

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
            dispatch(updateAssignmentCompleted({id: oldAssignment.id, completed: !oldAssignment.completed}))
            setOldAssignment(undefined)
            console.log("run")
        }
    }

    //Renders a cell for each day, if the day is the first of the month, it will render a header for the month
    const renderItem = (item: DateAssignments) => {
        return (
            <View>
                {item.isFirstofMonth && <Text style={{paddingBottom: 5, fontSize: 30, fontWeight: "bold"}}>{item.date.split(" ")[1]}</Text>}
                <View style={{"paddingVertical": 10, "backgroundColor": "white", flexDirection: "row"}} >
                    <View style={{flex:1, alignContent: "center"}} >
                        <Text style={{textAlign: "center", fontSize:20}} >{item.date.split(" ")[2]}</Text>
                    </View>
                    <AssignmentCell data={item.assignments} setOldAssignment={setOldAssignment} />
                </View> 
            </View>
        )
    }

    return (
        <View style={styles.assingmentView}>
            <FlatList ItemSeparatorComponent={()=><View style={styles.line}/>} keyExtractor={(item: DateAssignments, index: number) => {return item.date}} style={{height: "100%", width: "100%", paddingLeft: 10}} scrollEnabled data={props.data}  renderItem={({ item }) => renderItem(item)} />
        </View>
    )
}

interface AssignmentCellProps {
    data: StoredAssignmentInfo[]
    setOldAssignment: (assignment: StoredAssignmentInfo) => void
}

const AssignmentCell = (props: AssignmentCellProps) => {
    const dispatch = useDispatch()

    return (
        <View style={{flexDirection: "column", flexWrap: "wrap", flex:3.5}}>
            {props.data.map((assignment) => {
                const isOverdue = new Date(assignment.date) < new Date();
                return (<View style={{width:"100%", paddingBottom: 10, paddingRight: 10}} key={assignment.id} >
                            <BouncyCheckbox isChecked={assignment.completed} disableBuiltInState  style={{flexDirection: "row-reverse"}} textStyle={isOverdue?{color:"red"}:{}} textContainerStyle={{flex: 1, flexDirection: "row", justifyContent: "flex-start"}} text={assignment.name + " - " + assignment.class} onPress={() => (props.setOldAssignment({...assignment, completed: !assignment.completed}), dispatch(updateAssignmentCompleted({id: assignment.id, completed: !assignment.completed})))} />
                        </View>)
            })}
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