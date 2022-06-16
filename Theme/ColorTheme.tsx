import { useLayoutEffect, useState } from 'react';
import { Text, View, StyleSheet, ListRenderItemInfo, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { FlatList } from 'react-native-gesture-handler';
import { TableView, Cell, Separator } from 'react-native-tableview-simple';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux';
import { removeColorTheme, selectColorTheme } from '../redux/colorThemeSlice';
import { Ionicons } from '@expo/vector-icons';
import { ColorTheme } from '../types';
import { ColorThemeData } from '../redux/colorThemeSlice';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from './ThemeProvider';
interface ThemeData {
    name: string,
    colors: string[],
    canEdit: boolean
}

const RightAction = () => (
    <View style={{backgroundColor: "red", width: "100%", alignItems: "flex-end", justifyContent: "center", padding: 10}}>
        <Ionicons name='trash-outline' color={"white"} size={24} />
    </View>
)

const ColorThemeScreen = () => {
    const colorThemes = useSelector((state: RootState) => state.colorTheme)
    const [isEditing, setIsEditing] = useState(false)
    const dispatch = useDispatch()
    const navigation = useNavigation<ColorTheme>()
    const systemColors = useTheme()

    //Add buttons to the header
    useLayoutEffect(() => {
        !isEditing ?
        navigation.setOptions({
            headerRight: () => <Button title='Edit' onPress={()=>setIsEditing((isEditing)=>!isEditing)} />,
            headerLeft: undefined,
            gestureEnabled: true
        }) :
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => {navigation.navigate("EditColorTheme",{})}}>
                    <Ionicons name="add" size={32} color={systemColors.textColor} />
                </TouchableOpacity>
            ),
            headerLeft: () => (
                <Button title='Done' onPress={()=>setIsEditing((isEditing)=>!isEditing)} />
            ),
            gestureEnabled: false
        })
    })

    const renderItem = ({item, separators}: {item: ColorThemeData, separators: ListRenderItemInfo<ColorThemeData>["separators"]}) => {
        const selected = colorThemes.selected === item.name
        return (
            <Swipeable hitSlop={{"left":-50}} renderRightActions={RightAction} onSwipeableOpen={()=>dispatch(removeColorTheme(item.name))}>
                <Cell 
                    cellContentView={
                        <View style={{flex: 1, flexDirection: "row", height: "100%", width: "100%", marginRight: isEditing? 3 : (selected?0:20)}}>
                            <Text 
                                style={{
                                    fontSize: 16,
                                    letterSpacing: -0.32,
                                    alignSelf: "center",
                                    flexShrink: 1,
                                    color: systemColors.textColor,
                                }}
                                numberOfLines={1}
                            >
                                {item.name}
                            </Text>
                            <View style={{flexDirection: "row", height: "100%", flexGrow: 1, justifyContent: "flex-end", marginRight: 10}}>
                                {item.colors.slice(0,6).map((color, index) => (
                                    <View key={index.toString()} style={{backgroundColor: color, borderRadius: 60, aspectRatio: 1, marginLeft: 3, height: 25, alignSelf: "center"}} />
                                ))}
                            </View>
                        </View>
                    }
                    onPress={()=>{isEditing ? navigation.navigate("EditColorTheme",{initialData : { name: item.name, isEditable: item.isEditable, colors: item.colors }}) : dispatch(selectColorTheme(item.name))}}
                    onHighlightRow={separators.highlight}
                    onUnHighlightRow={separators.unhighlight}
                    accessory={isEditing ? "DisclosureIndicator" : (selected ? "Checkmark" : undefined)}
                />
            </Swipeable>
        )
    }

    return (
        <View style={styles.container}>
            <TableView style={styles.tableView}>
                <FlatList 
                    keyExtractor={(item)=>item.name} 
                    data={colorThemes.colorThemes} 
                    renderItem={renderItem} 
                    ItemSeparatorComponent={({ highlighted }) => (
                        <Separator isHidden={highlighted} />
                    )}
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
        width: '100%',
    }
});

export default ColorThemeScreen;
