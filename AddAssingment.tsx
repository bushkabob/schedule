import { View, StyleSheet } from 'react-native'
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { TableView, Cell, Separator } from 'react-native-tableview-simple';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SelectScreenProps } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux';

const AddAssingment = () => {
    const classOptions = useSelector((state: RootState) => state.classes)
    const [assignmentName, setAssingmentName] = useState("")
    const [selectedClass, setSelectedClass] = useState(classOptions[0])
    const navigation = useNavigation<SelectScreenProps>()

    return(
        <View style={styles.container}>
            <ScrollView style={styles.container} scrollEnabled>
                <TableView style={styles.tableView}>
                    <Cell cellContentView={
                        <TextInput placeholder='Assignment Name' allowFontScaling style={styles.textInput} onChangeText={(text)=>setAssingmentName(text)} />
                    } />
                    <Separator />
                    <Cell cellStyle="RightDetail" title="Class" detail={selectedClass} accessory="DisclosureIndicator" onPress={()=>navigation.navigate("SelectListOption", { options: classOptions, selectOption: setSelectedClass, selected: selectedClass})}/>
                </TableView>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
    tableView: {
        flex: 1,
        width: "100%",
    },
    textInput: {
        width: "100%",
        height: "100%",
        fontSize: 16
    }
});

export default AddAssingment