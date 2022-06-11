import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { View, Text, Animated } from "react-native"
import BouncyCheckbox from "react-native-bouncy-checkbox"
import { Swipeable } from "react-native-gesture-handler"
import { useDispatch } from "react-redux"
import { removeAssignment, StoredAssignmentInfo, updateAssignmentCompleted } from "./redux/assingmentsSlice"
import { useTheme } from "./Theme/ThemeProvider"
import { AddAssigmentProps } from "./types"

interface SwipeableAssignmentCellProps {
    assignment: StoredAssignmentInfo
    setOldAssignment: (assignment: StoredAssignmentInfo) => void
    updateSwipeableRef: (id: string, ref: Swipeable|null) => void
    closeRow: (id: string) => void
    setPrevOpenRow: (ref: Swipeable|null) => void
    color: string
}

//Swipeable assignment cell that renders a single assignment
const SwipeableAssignmentCell = (props: SwipeableAssignmentCellProps) => {
    const isOverdue = new Date(props.assignment.date) < new Date() && !props.assignment.completed;
    const dispatch = useDispatch()
    const navigation = useNavigation<AddAssigmentProps>()
    const systemColors = useTheme()

    //Right action - appears on swipe
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
            <View style={{flexDirection: "row", marginRight: 15}}>
                <Animated.View style={[{borderRadius: 30, backgroundColor: systemColors.systemGray, height: "100%", aspectRatio: 1, justifyContent: "center", alignItems: "center", marginRight: 3}, {transform: [{scale: scaleEdit}]}]}>
                    <Ionicons name='ellipsis-horizontal-circle-outline' color={"white"} size={24} onPress={()=>navigation.navigate("AddAssignment",{ assignment: assignment })} />
                </Animated.View>
                <Animated.View style={[{borderRadius: 30, backgroundColor: systemColors.red, height: "100%", aspectRatio: 1, justifyContent: "center", alignItems: "center"}, {transform: [{scale: scaleDelete}]}]}>
                    <Ionicons 
                        name='trash-outline' 
                        color={"white"} 
                        size={24} 
                        onPress={()=>{dispatch(removeAssignment({ id: assignment.id })); props.setPrevOpenRow(null)}} 
                    />
                </Animated.View>
            </View>
        );
    }

    return (
        <View style={{width:"100%", paddingBottom: 5}} key={props.assignment.id} >
            <Swipeable 
                key={props.assignment.id} 
                ref={ref => props.updateSwipeableRef(props.assignment.id,ref)} 
                onSwipeableOpen={()=>props.closeRow(props.assignment.id)} 
                containerStyle={{}} 
                renderRightActions={(progress, dragX) => RightAction(progress, dragX, props.assignment)}
            >
                <View style={{padding: 10, flexDirection:"row", marginHorizontal: 10, justifyContent:"space-between", backgroundColor: systemColors.elevated, borderRadius: 10}} >
                    <View style={{justifyContent: "center"}}>
                        <Text style={isOverdue?{color:systemColors.red}:{color:systemColors.textColor}}>
                            {props.assignment.name + " - " + props.assignment.class}
                        </Text>
                    </View>
                    <BouncyCheckbox 
                        isChecked={props.assignment.completed} 
                        disableBuiltInState  style={{flexDirection: "row-reverse"}} 
                        onPress={() => (props.setOldAssignment({...props.assignment, completed: !props.assignment.completed}), dispatch(updateAssignmentCompleted({id: props.assignment.id, completed: !props.assignment.completed})))} 
                        fillColor={props.color}
                    />
                </View>
            </Swipeable>
        </View>
    )
}

export default SwipeableAssignmentCell;