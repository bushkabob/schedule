import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SettingsProps, AddAssignmentNavigatorProps } from "./types";
import { useTheme } from "./Theme/ThemeProvider";

export const HomeHeaderRight = () => {
    const systemColors = useTheme()
    const navigation = useNavigation<AddAssignmentNavigatorProps>()
    return (
        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}} >
            <TouchableOpacity style={{paddingRight: 5}} onPress={() => navigation.navigate("CalendarNavigator",{})}>
                <Ionicons name="md-calendar" color={systemColors.textColor} size={26} />
            </TouchableOpacity>
            <TouchableOpacity style={{paddingLeft: 5}} onPress={() => navigation.navigate("AddAssignmentNavigator",{})}>
                <Ionicons name="add" color={systemColors.textColor} size={32}/>
            </TouchableOpacity>
        </View>
    )  
}

export const AndroidHomeHeaderRight = () => {
    const systemColors = useTheme()
    const navigation = useNavigation<AddAssignmentNavigatorProps>()
    return (
        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity style={{paddingRight: 7}} onPress={() => navigation.navigate("Settings",{})}>
                <Ionicons name="cog-outline" color={systemColors.textColor} size={32}/>
            </TouchableOpacity>
            <TouchableOpacity style={{paddingHorizontal: 5}} onPress={() => navigation.navigate("CalendarNavigator",{})}>
                <Ionicons name="md-calendar" color={systemColors.textColor} size={26} />
            </TouchableOpacity>
            <TouchableOpacity style={{paddingLeft: 4}} onPress={() => navigation.navigate("AddAssignmentNavigator",{})}>
                <Ionicons name="add" color={systemColors.textColor} size={32}/>
            </TouchableOpacity>
        </View>
    )
}

export const HomeHeaderLeft = () => {
    const systemColors = useTheme();
    const navigation = useNavigation<SettingsProps>()
    return (
        <TouchableOpacity onPress={() => navigation.navigate("Settings",{})}>
            <Ionicons name="cog-outline" color={systemColors.textColor} size={32}/>
        </TouchableOpacity>
    )
}
