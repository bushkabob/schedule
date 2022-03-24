import { View, StyleSheet, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { SelectScreenRouteProps } from "./types";
import { TableView, Separator, Cell } from "react-native-tableview-simple";
import { useState } from "react";

const SelectOptionScreen = () => {
    const route = useRoute<SelectScreenRouteProps>();
    const [selected, setSelected] = useState(route.params.selected)

    const renderRow = (item: string, selected: boolean) => {
        return <Cell title={item} onPress={()=>(route.params.selectOption(item),setSelected(item))} accessory={selected?"Checkmark":undefined} />
    }

    return (
        <View style={styles.container}>
            <TableView style={styles.tableView}>
                <FlatList
                    data={route.params.options}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => renderRow(item, item===selected)}
                    ItemSeparatorComponent={({ highlighted }) => (
                        <Separator isHidden={highlighted} />
                    )}
                    showsVerticalScrollIndicator
                />
            </TableView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    tableView: {
        flex: 1,
        width: "100%",
    }
});

export default SelectOptionScreen