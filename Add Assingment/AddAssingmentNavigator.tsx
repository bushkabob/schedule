import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AddAssingment from "./AddAssingment"
import SelectOptionScreen from "./SelectOptionScreen"

const Stack = createNativeStackNavigator()

const AddAssignmentNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="AddAssignment" >
            <Stack.Screen name="AddAssignment" component={AddAssingment} options={{title: "Add Assignment"}} />
            <Stack.Screen name="SelectListOption" component={SelectOptionScreen} />
        </Stack.Navigator>
    )
}

export default AddAssignmentNavigator;