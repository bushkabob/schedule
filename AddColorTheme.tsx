import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Cell, Section, Separator, TableView } from 'react-native-tableview-simple';
import { TextInput, View, StyleSheet, Text, Button, Appearance } from 'react-native';
import { AddColorThemeRouteProps, EditColorThemeRouteProps, SelectColorProps, SelectedColorReturnRouteProps, AddColorThemeProps } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { addColorTheme, removeColorTheme } from './redux/colorThemeSlice';
import { RootState } from './redux';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { Ionicons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

const RightAction = () => (
    <View style={{backgroundColor: "red", width: "100%", alignItems: "flex-end", justifyContent: "center", padding: 10}}>
        <Ionicons name='trash-outline' color={"white"} size={24} />
    </View>
)

interface ColorCellProps {
    color: string
    index: number
    isEditable: boolean
    isEditing: boolean
    isEnd: boolean
    colorLength: number
    ogName: string
    removeColor: (index: number) => void
    drag: ()=>void
}

const ColorCell = (props: ColorCellProps) => {
    const [isActive, setIsActive] = useState(false);
    const navigation = useNavigation<SelectColorProps>();
    const topBorder = props.index === 0 ? {borderTopColor: "#C8C7CC", borderTopWidth: StyleSheet.hairlineWidth} : {}
    const bottomBorder = props.isEnd ?  {borderBottomColor: "#C8C7CC", borderBottomWidth: StyleSheet.hairlineWidth} : {}
    return (
        <ScaleDecorator>
            <Swipeable hitSlop={{"left": -50}} renderRightActions={props.colorLength>1?RightAction:()=><View></View>} onSwipeableOpen={()=>props.removeColor(props.index)} >
                <Cell 
                    cellContentView={
                        <View style={{flexGrow: 1, flexDirection: "row", height: "100%"}}>
                            <Text  style={styles.textField} numberOfLines={1}>
                                {"Color " + (props.index + 1)}
                            </Text>
                            <View style={{flexDirection: "row", height: "100%"}}>
                                <View style={{backgroundColor: props.color, borderRadius: 60, aspectRatio: 1, height: 25, alignSelf: "center"}} />
                            </View>
                        </View>
                    }
                    isDisabled={!props.isEditable||props.isEditing}
                    onPress={()=>navigation.navigate("SelectColor", {selectedColor: props.color, index: props.index, name: props.ogName})}
                    accessory={props.isEditable?"DisclosureIndicator":undefined}
                    cellAccessoryView={props.isEditing&&<Ionicons style={{paddingLeft: 20}} onLongPress={props.drag} name="reorder-three-outline" size={24} color={Appearance.getColorScheme()==="light"?"black":"white"} />}
                    contentContainerStyle={[topBorder, bottomBorder]}
                />
            </Swipeable>
            {props.index < props.colorLength-1 && <Separator isHidden={isActive} />}
        </ScaleDecorator>
    )
}



const AddColorTheme = () => {
    const navigation = useNavigation<AddColorThemeProps>()
    const route = useRoute<AddColorThemeRouteProps | EditColorThemeRouteProps | SelectedColorReturnRouteProps>()
    const initialData = "colors" in route.params ? route.params : {name: "", isEditable: true, colors: ["#FAF9F6"]};
    const [name, setName] = useState(initialData.name)
    const [colors, setColors] = useState(initialData.colors)
    const [isEditing, setIsEditing] = useState(false)
    const isEditable = initialData.isEditable
    const colorThemeNames = useSelector((state: RootState) => state.colorTheme.colorThemes.map(({name}) => name))
    const dispatch = useDispatch()
    //Start of code to update the color based on the selected color
    const updateSelectedColor = (index: number, color: string) => {
        typeof color !== "undefined" && setColors(colors.map((c, i) => i === index ? color : c))
    }

    useFocusEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            "selectedColor" in route.params && updateSelectedColor(route.params.index, route.params.selectedColor)
        });
    
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      });

    //End of code to update the color based on the selected color

    //Code for deleteing a color
    const removeColorAtIndex = (index: number) => {
        setColors(colors.filter((_, i) => i !== index))
    }
    
    //Renders Item
    const renderItem = (color: string, index: number, drag: ()=>void) => {
        return <ColorCell ogName={initialData.name} drag={drag} color={color} index={index} isEditable={isEditable} removeColor={removeColorAtIndex} isEnd={index===colors.length-1} colorLength={colors.length} isEditing={isEditing} />
    }

    /*
    <Button
        title="Save" 
        onPress={
            () => (
                dispatch(addColorTheme({ "name": name, "isEditable": isEditable, "colors": colors })), 
                dispatch(removeColorTheme(initialData.name)), 
                navigation.goBack()
            )
        } 
        disabled={name === "" || (colorThemeNames.includes(name) &&  initialData.name !== name)}
    />
    */
    //Add Save button and make clickable when appropriate criteria is met
    useLayoutEffect(() => {
        if (isEditable) {
            isEditing ?
            navigation.setOptions({
                headerLeft: () => <Button title='Done' onPress={() => setIsEditing(false)} />,
                headerRight: () => undefined
            })
            :
            navigation.setOptions({
                headerRight: () => <Button title='Edit' onPress={() => setIsEditing(true)} />,
                headerLeft: () => undefined
            })
        } else {
            navigation.setOptions({
                title: name,
            })
        }
    })
    return (
        <TableView style={styles.container}>
            <DraggableFlatList 
                keyExtractor={(_, index)=>{return index.toString() + colors.length.toString()}}
                data={colors}
                renderItem={(info)=>((typeof info.index !== "undefined") ? renderItem(info.item, info.index, info.drag) : <View></View>)} 
                containerStyle={{flex: 1}}
                ListHeaderComponent={
                    <Section>
                        <Cell 
                            cellContentView={
                                <TextInput 
                                    defaultValue={name}
                                    pointerEvents={isEditable ? 'auto' : 'none'}
                                    style={styles.textField}
                                    placeholder={"Theme Name"}
                                    onChangeText={(text) => setName(text)}
                                />
                            }
                        />
                    </Section>
                }
                ListFooterComponent={
                    <View>
                        {isEditable && (
                            <View>
                                <Section>
                                    <Cell 
                                        cellContentView={
                                            <View style={{justifyContent: "center", alignItems: "center", flex: 1}} pointerEvents="none" >
                                                <Button title={"Add Color"} onPress={()=>setColors((colors)=>[...colors, "#FAF9F6"])} />
                                            </View>
                                        } 
                                        onPress={()=>setColors((colors)=>[...colors, "#FAF9F6"])}
                                    />
                                    <Cell 
                                        cellContentView={
                                            <View style={{justifyContent: "center", alignItems: "center", flex: 1}} pointerEvents="none" >
                                                <Button 
                                                    title={"Save"} 
                                                    onPress={()=>{}}
                                                    disabled={name === "" || (colorThemeNames.includes(name) && "name" in route.params ? route.params.name !== name : colorThemeNames.includes(name))}
                                                />
                                            </View>
                                        } 
                                        isDisabled={name === "" || (colorThemeNames.includes(name) && "name" in route.params ? route.params.name !== name : colorThemeNames.includes(name))}
                                        onPress={()=>(
                                            dispatch(removeColorTheme(name)),
                                            dispatch(addColorTheme({ "name": name, "isEditable": isEditable, "colors": colors })), 
                                            navigation.goBack()
                                        )}
                                    />
                                </Section>
                            </View>
                        )}
                    </View>
                }
                dragHitSlop={{"left": -50}}
            />
        </TableView>
    )
}

/*<View style={{flexDirection: "row", height: "100%", width: "80%"}} >
                                        <Text style={styles.textField}>
                                            {"Color " + (index + 1)}
                                        </Text>
                                        <View style={[{backgroundColor: color}, styles.colorView]} />
                                    </View>*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    textField: {
        fontSize: 16,
        letterSpacing: -0.32,
        alignSelf: "center",
        flexGrow: 1,
    },
    colorView: { 
        borderRadius: 60, 
        aspectRatio: 1, 
        marginLeft: 3, 
        height: 25, 
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "flex-end"
    },
})

export default AddColorTheme;