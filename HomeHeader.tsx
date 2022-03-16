import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const HomeHeaderRight = () => {
    return (
        <TouchableOpacity onPress={() => alert("add assingment")}>
            <Ionicons name="add" size={32}/>
        </TouchableOpacity>
    )
}

export const HomeHeaderLeft = () => {
    return (
        <TouchableOpacity onPress={() => alert("settings")}>
            <Ionicons name="cog-outline" size={32}/>
        </TouchableOpacity>
    )
}
