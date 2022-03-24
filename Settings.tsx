import { View, StyleSheet } from "react-native"
import { StatusBar } from 'expo-status-bar';
import { Cell, TableView } from "react-native-tableview-simple";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { AddClassProps } from "./types";

const Settings = () => {
    const navigation = useNavigation<AddClassProps>()

    return(
        <View>
            <StatusBar style="auto" />
            <ScrollView style={styles.container} scrollEnabled>
                <TableView style={styles.tableView}>
                    <Cell title="Classes" accessory={"DisclosureIndicator"} onPress={()=>navigation.navigate("AddClass",{})} />
                </TableView>   
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
    tableView: {
        flex: 1,
        width: "100%",
    }
})

export default Settings