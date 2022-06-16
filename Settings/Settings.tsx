import { View, StyleSheet, FlatList, ListRenderItemInfo } from "react-native"
import { StatusBar } from 'expo-status-bar';
import { Cell, Separator, TableView } from "react-native-tableview-simple";
import { useNavigation } from "@react-navigation/native";
import { AddClassProps, EditAssignmentTypesProps } from "../types";
import { useDispatch } from "react-redux";
import { removeAllAssignments } from "../redux/assingmentsSlice";
import { useState } from "react";
import { CellInterface } from "react-native-tableview-simple/lib/typescript/components/Cell";

interface CellData {
    title: string,
    func: ()=>void,
    accessory: CellInterface["accessory"]
}

const Settings = () => {
    const navigation = useNavigation<AddClassProps | EditAssignmentTypesProps>()
    const dispatch = useDispatch()
    const [separatorHidden, setSeparatorHidden] = useState([false, false])
    const cellData: CellData[] = [
        {title: "Classes", func: ()=>navigation.navigate("AddClass",{}), accessory: "DisclosureIndicator"}, 
        {title: "Assignment Type", func: ()=>navigation.navigate("EditAssignmentTypes",{}), accessory: "DisclosureIndicator"}, 
        {title: "Select Color Theme", func: ()=>navigation.navigate("ColorTheme",{}), accessory: "DisclosureIndicator"},
        {title: "Clear Assignments", func: ()=>{dispatch(removeAllAssignments())}, accessory: undefined}
    ]


    const changeSeparatorHidden = (setHidden: boolean, index: number) => {
        const newSeparatorHidden = [...separatorHidden]
        newSeparatorHidden[index] = setHidden
        setSeparatorHidden(newSeparatorHidden)
    }

    //Function for rendering cells
    const renderItem = ({item, separators}: {item: CellData, separators: ListRenderItemInfo<CellData>["separators"]}) => {
        return (
            <Cell 
                title={item.title} 
                accessory={item.accessory} 
                onPress={item.func} 
                onHighlightRow={separators.highlight}
                onUnHighlightRow={separators.unhighlight} 
            />
        )
    }

    return(
        <View>
            <StatusBar style="auto" />
            <View style={styles.container}>
                <TableView style={styles.tableView}>
                    <FlatList 
                        keyExtractor={(item) => item.title} 
                        data={cellData} 
                        renderItem={renderItem} 
                        ItemSeparatorComponent={({ highlighted }) => (
                            <Separator isHidden={highlighted} />
                        )} 
                    />
                </TableView>
            </View>
        </View>
    )
}

//Old cells

/*
<Cell title="Classes" accessory={"DisclosureIndicator"} onPress={()=>navigation.navigate("AddClass",{})} onHighlightRow={() => changeSeparatorHidden(true, 0)} onUnHighlightRow={() => changeSeparatorHidden(false, 0)} />
                    <Separator isHidden={separatorHidden[0]} />
                    <Cell title="Assignment Type" accessory={"DisclosureIndicator"} onPress={()=>navigation.navigate("EditAssignmentTypes",{})} onHighlightRow={() => (changeSeparatorHidden(true, 1), changeSeparatorHidden(true, 0))} onUnHighlightRow={() => (changeSeparatorHidden(false, 1), changeSeparatorHidden(false, 0))} />
                    <Separator isHidden={separatorHidden[1]} />
                    <Cell title="Delete Class Data" onPress={() => {dispatch(removeAllAssignments())}} onHighlightRow={() => changeSeparatorHidden(true, 1)} onUnHighlightRow={() => changeSeparatorHidden(false, 1)}/>
*/

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