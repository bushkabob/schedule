import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SettingsProps, AddAssingmentProps } from "./types";

export const HomeHeaderRight = () => {
    const navigation = useNavigation<AddAssingmentProps>()
    return (
        <TouchableOpacity onPress={() => navigation.navigate("AddAssingment",{})}>
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
