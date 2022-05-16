import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SettingsProps, AddAssignmentNavigatorProps } from "./types";

export const HomeHeaderRight = () => {
    const navigation = useNavigation<AddAssignmentNavigatorProps>()
    return (
        <TouchableOpacity onPress={() => navigation.navigate("AddAssignmentNavigator",{})}>
            <Ionicons name="add" size={32}/>
        </TouchableOpacity>
    )
}

export const HomeHeaderLeft = () => {
    const navigation = useNavigation<SettingsProps>()
    return (
        <TouchableOpacity onPress={() => navigation.navigate("Settings",{})}>
            <Ionicons name="cog-outline" size={32}/>
        </TouchableOpacity>
    )
}
