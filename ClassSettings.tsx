import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Cell, TableView, Separator } from 'react-native-tableview-simple';
import { FlatList, Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import Dialog from 'react-native-dialog'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './redux';
import { addClass, removeClass } from './redux/classSlice';

const RightAction = () => (
    <View style={{backgroundColor: "red", width: "100%", alignItems: "flex-end", justifyContent: "center", padding: 10}}>
        <Ionicons name='trash-outline' color={"white"} size={24} />
    </View>
)

interface AddClassHeaderRightProps {
    updateEnteringClass: (value: React.SetStateAction<boolean>) => void
}

export const AddClassHeaderRight = (props: AddClassHeaderRightProps) => {
    return (
        <TouchableOpacity onPress={() => {props.updateEnteringClass(true)}}>
            <Ionicons name="add" size={32}/>
        </TouchableOpacity>
    )
}

const ClassSettings = () => {
    const classes = useSelector((state: RootState) => state.classes)
    const dispatch = useDispatch()
    const [isEnteringClass, updateEnteringClass] = useState(false);
    const [newName, updateNewName] = useState("");
    const navigation = useNavigation()

    const removeClassAtIndex = (item: string) => {
        // updateClasses((prevState) => {
        //     //slice out the class at the index
        //     const newClasses = prevState.slice(0, index).concat(prevState.slice(index + 1));
        //     return newClasses;
        // })
        dispatch(removeClass({ name: item }));
    }

    const renderRow = (item: string, _: number): JSX.Element => {
        return (
            <Swipeable key={item} renderRightActions={RightAction} onSwipeableOpen={()=>removeClassAtIndex(item)}>
                <Cell title={item} />
            </Swipeable>
        )
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <AddClassHeaderRight updateEnteringClass={()=>updateEnteringClass(true)} />
        })
    },[])

    //Handle adding a class to the list
    const handleCancel = () => {updateEnteringClass(false), updateNewName("")}
    const handleAdd = () => {
        // updateClasses((prev) =>[...prev, newName])
        dispatch(addClass({ name:newName }))
        updateEnteringClass(false)
        updateNewName("")
    }
    const handleChange = (text: string) => {
        updateNewName(text)
    }

    return(
        <View style={styles.container}>
            <TableView style={styles.tableView}>
                <FlatList
                    data={classes}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => renderRow(item, index)}
                    ItemSeparatorComponent={({ highlighted }) => (
                        <Separator isHidden={highlighted} />
                    )}
                    showsVerticalScrollIndicator
                />
            </TableView>
            <Dialog.Container visible={isEnteringClass}>
                <Dialog.Title>Add class</Dialog.Title>
                <Dialog.Description>
                Please enter the name of the class you would like to add
                </Dialog.Description>
                <Dialog.Input placeholder='Class Name' onChangeText={handleChange} />
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="Add" bold onPress={handleAdd} color={(newName==""||classes.includes(newName))?"gray":"#007ff9"} disabled={(newName==""||classes.includes(newName))} />
            </Dialog.Container>
        </View>
    );
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

export default ClassSettings;