import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SettingsProps, AddAssignmentNavigatorProps } from "./types";
import { useTheme } from "./Theme/ThemeProvider";

export const HomeHeaderRight = () => {
    const systemColors = useTheme()
    const navigation = useNavigation<AddAssignmentNavigatorProps>()
    return (
        <TouchableOpacity onPress={() => navigation.navigate("AddAssignmentNavigator",{})}>
            <Ionicons name="add" color={systemColors.textColor} size={32}/>
        </TouchableOpacity>
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
