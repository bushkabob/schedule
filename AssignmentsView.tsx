import { View, Text, FlatList, StyleSheet, NativeSyntheticEvent, NativeScrollEvent, Appearance } from "react-native";
import { useState, useEffect, useRef, forwardRef, ForwardedRef, memo } from "react";
import { updateAssignmentCompleted, StoredAssignmentInfo } from "./redux/assingmentsSlice"
import { useDispatch, useSelector } from "react-redux";
import { Accelerometer } from 'expo-sensors';
import { Subscription } from "expo-sensors/build/Pedometer";
import { Swipeable } from "react-native-gesture-handler";
import Dialog from "react-native-dialog";
import SwipeableAssignmentCell from "./AssignmentViewCell";
import ColorIndicator from "./ColorIndicator";
import { RootState } from "./redux";
import { getColor } from "./utils";
import { useTheme } from "./Theme/ThemeProvider";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";

interface DateAssignments {
    date: string,
    isFirstofMonth: boolean,
    assignments: StoredAssignmentInfo[]
}

type OnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => void

interface AssignmentViewProps {
    assignments: scrollItem[]
    updateSharedValue: (val: number) => void
    themeMode: string
    secondaryCheck: string
}

interface scrollItem {
    date: string;
    isFirstofMonth: boolean;
    assignments: StoredAssignmentInfo[];
}

//Main Screen
const AssignmentsView = forwardRef((props: AssignmentViewProps, ref: ForwardedRef<FlatList<any>>) => {
    const dispatch = useDispatch();
    const [oldAssignment, setOldAssignment] = useState<StoredAssignmentInfo>()
    //const [subscription, setSubscription] = useState<Subscription|null>(null);
    const swipeableRefs = useRef<{[key:string]:Swipeable|null}>({})
    const [prevOpenedRow, setPrevOpenedRow] = useState<Swipeable | null>(null)
    const [dialogVisible, setDialogVisible] = useState(false)
    const systemColors = useTheme()
    // const scrollHandler = useAnimatedScrollHandler({
    //     onScroll(event) {
    //         console.log(event.contentOffset.y)
    //         props.updateSharedValue(event.contentOffset.y)
    //     },
    // })

    //Class colors
    const theme = useSelector((state: RootState) => state.colorTheme.colorThemes.filter((colorTheme) => colorTheme.name === state.colorTheme.selected)[0])
    const classes = useSelector((state: RootState) => state.classes)

    //Accelerometer code
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });

    // useEffect(() => {
    //     const acceleration = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
    //     if (acceleration > 3) {
    //         console.log("shake")
    //         handleShake();
    //     }
    // }, [data])

    // useEffect(() => {
    //     _subscribe();
    //     return () => _unsubscribe();
    // }, []);

    // const _subscribe = () => {
    //     setSubscription(
    //         Accelerometer.addListener(accelerometerData => {
    //             setData(accelerometerData);
    //         })
    //     );
    //     Accelerometer.setUpdateInterval(100);
    // };

    // const _unsubscribe = () => {
    //     subscription && subscription.remove();
    //     setSubscription(null);
    // };

    // //undo last change if the user shakes their device
    // const handleShake = () => {
    //     if (typeof oldAssignment !== "undefined") {
    //         setDialogVisible(true)
    //     }
    // }

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
            <View style={{marginTop: 10}}>
                <View>
                    {item.isFirstofMonth && 
                        <View style={[{marginBottom: 10}, styles.shadow]}> 
                            <Text style={{marginHorizontal: 10, fontSize: 30, fontWeight: "bold", paddingVertical:5, color: systemColors.textColor}}>{item.date.split(" ")[1]}</Text> 
                        </View>
                    }
                    <View style={[{paddingVertical: 10}, styles.shadow]} >
                        <View style={{alignItems: "center", flexDirection: "row", flexGrow: 1, height: 40}}>
                            <Text style={{fontSize:20, marginHorizontal: 20, color: systemColors.textColor}} >{item.date.split(" ")[2]}</Text>
                            <View style={{flexDirection: "row", flexGrow: 1, justifyContent: "flex-end", marginHorizontal: 10}} >
                                {colors.map((color) => <ColorIndicator key={color} style={{marginHorizontal: 2}} color={getColor(color, theme.colors)} />)}
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
                                        color={getColor(classes.findIndex((classInfo) => classInfo === assignment.class), theme.colors)}
                                    />
                                )
                            })}
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    // TODO: Why does this work?? 
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
                data={props.assignments}
                renderItem={({ item } : {item: scrollItem}) => renderItem(item)}
                ListFooterComponent={() => <View style={{height: 50}} />}
                //onScroll={scrollHandler}
                //getItemLayout={(data: DateAssignments, index: number) => {return {length: 100, offset: 100 * index, index}}}
                onScrollToIndexFailed={()=>{console.log("Scroll failed")}}
                ref={ref}
                key={props.themeMode}
            />
        </View>
    )
})

//Assignment Cell Content w/ swipeable functionality
// const areEqual = (prevProps: AssignmentViewProps, nextProps: AssignmentViewProps) => {
//     const checkElement = (val1: StoredAssignmentInfo[], val2:StoredAssignmentInfo[]) => {
//         return val1.reduce((prev, curr, index) => {
//             return prev && JSON.stringify(curr) === JSON.stringify(val2[index])
//         }, true)
//     }
//     const same = prevProps.assignments.reduce((prev, curr, index) => {
//         //console.log(checkElement(curr.assignments, nextProps.assignments[index].assignments))
//         if(nextProps.assignments.length > index){
//             return prev && checkElement(curr.assignments, nextProps.assignments[index].assignments)
//         } else {
//             return false
//         }
//         //curr.assignments === nextProps.assignments[index].assignments
//     }, true)
//     const match = same && prevProps.themeMode === nextProps.themeMode
//     return match
// };

export default AssignmentsView;

const styles = StyleSheet.create({
    assingmentView: {
        flex: 1,
        width: "100%",
        alignItems: "center",
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