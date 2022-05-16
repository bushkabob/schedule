import { View, StyleSheet, FlatList, Button } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SelectScreenProps, SelectScreenRouteProps } from "./types";
import { TableView, Separator, Cell } from "react-native-tableview-simple";
import { useLayoutEffect, useState } from "react";

const SelectOptionScreen = () => {
    const route = useRoute<SelectScreenRouteProps>();
    const [selected, setSelected] = useState(route.params.selected)

    const renderRow = (item: string, isSelected: boolean) => {
        return <Cell title={item} onPress={()=>(setSelected(item), route.params.updateSelected(item))} accessory={isSelected?"Checkmark":undefined} />
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