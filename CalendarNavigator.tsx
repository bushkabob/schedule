import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Calendar from "./Calendar";

const Stack = createNativeStackNavigator()

const CalendarNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="AddAssignment" >
            <Stack.Screen name="AddAssignment" initialParams={{}} component={Calendar} options={{title: "Calendar"}} />
        </Stack.Navigator>
    )
}

export default CalendarNavigator;