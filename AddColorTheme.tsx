import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useLayoutEffect, useState } from 'react';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { ScrollView, TextInput, View, StyleSheet, Text, Button } from 'react-native';
import { AddColorThemeRouteProps, EditColorThemeRouteProps } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { addColorTheme, removeColorTheme } from './redux/colorThemeSlice';
import { RootState } from './redux';
import { color } from 'react-native-reanimated';

const AddColorTheme = () => {
    const navigation = useNavigation()
    const route = useRoute<AddColorThemeRouteProps | EditColorThemeRouteProps>()
    const initialData = "name" in route.params ? route.params : {name: "", isEditable: true, colors: ["#FAF9F6"]};
    const [name, setName] = useState(initialData.name)
    const [colors, setColors] = useState(initialData.colors)
    const isEditable = initialData.isEditable
    const colorThemeNames = useSelector((state: RootState) => state.colorTheme.colorThemes.map(({name}) => name))
    const dispatch = useDispatch()

    console.log(useSelector((state: RootState) => state.colorTheme.colorThemes))
    console.log(colors)

    useLayoutEffect(() => {
        if (isEditable) {
            navigation.setOptions({
                headerRight: () => 
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
            })
        } else {
            navigation.setOptions({
                title: name,
            })
        }
    })

    return (
        <View style={styles.container} >
            <ScrollView scrollEnabled >
                <TableView style={styles.container}>
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
                    <Section>
                        {colors.map((color, index) => (
                            <Cell 
                                key={index.toString()}
                                cellContentView={
                                    <View style={{flexGrow: 1, flexDirection: "row", height: "100%"}}>
                                        <Text  style={styles.textField} numberOfLines={1}>
                                            {"Color " + (index + 1)}
                                        </Text>
                                        <View style={{flexDirection: "row", height: "100%"}}>
                                            <View key={index.toString()} style={{backgroundColor: color, borderRadius: 60, aspectRatio: 1, height: 25, alignSelf: "center"}} />
                                        </View>
                                    </View>
                                }
                                accessory={isEditable?"DisclosureIndicator":undefined}
                            />
                        ))}
                    </Section>
                    {isEditable && (
                        <Section>
                            <Cell 
                                cellContentView={
                                    <View style={{justifyContent: "center", alignItems: "center", flex: 1}} pointerEvents="none" >
                                        <Button title={"Add Color"} onPress={()=>setColors((colors)=>[...colors, "#FAF9F6"])} />
                                    </View>
                                } 
                                onPress={()=>setColors((colors)=>[...colors, "#FAF9F6"])}
                            />
                        </Section>
                        )
                    }
                </TableView>
            </ScrollView>
        </View>
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