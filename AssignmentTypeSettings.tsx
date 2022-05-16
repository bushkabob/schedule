import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Cell, TableView, Separator } from 'react-native-tableview-simple';
import { FlatList, Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import Dialog from 'react-native-dialog'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './redux';
import { addAssignmentType, removeAssignmentType } from './redux/assignmentTypeSlice';

const RightAction = () => (
    <View style={{backgroundColor: "red", width: "100%", alignItems: "flex-end", justifyContent: "center", padding: 10}}>
        <Ionicons name='trash-outline' color={"white"} size={24} />
    </View>
)

interface HeaderRightProps {
    updateEnteringClass: (value: React.SetStateAction<boolean>) => void
}

const HeaderRight = (props: HeaderRightProps) => {
    return (
        <TouchableOpacity onPress={() => {props.updateEnteringClass(true)}}>
            <Ionicons name="add" size={32}/>
        </TouchableOpacity>
    )
}

const UserDefinedSettings = () => {
    //const [classes, updateClasses] = useState<string[]>([]);
    const availableOptions = useSelector((state: RootState) => state.assignmentTypes)
    const dispatch = useDispatch()
    const [isEntering, updateEntering] = useState(false);
    const [newItem, updateNewItem] = useState("");
    const navigation = useNavigation()

    const renderRow = (item: string, index: number): JSX.Element => {
        return (
            <Swipeable key={item} renderRightActions={RightAction} onSwipeableOpen={()=>dispatch(removeAssignmentType({ name: item }))}>
                <Cell title={item} />
            </Swipeable>
        )
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderRight updateEnteringClass={()=>updateEntering(true)} />
        })
    },[])

    //Handle adding a class to the list
    const handleCancel = () => {updateEntering(false), updateNewItem("")}
    const handleAdd = () => {
        // updateClasses((prev) =>[...prev, newName])
        dispatch(addAssignmentType({name: newItem}))
        updateEntering(false)
        updateNewItem("")
    }
    const handleChange = (text: string) => {
        updateNewItem(text)
    }

    return(
        <View style={styles.container}>
            <TableView style={styles.tableView}>
                <FlatList
                    data={availableOptions}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) => renderRow(item, index)}
                    ItemSeparatorComponent={({ highlighted }) => (
                        <Separator isHidden={highlighted} />
                    )}
                    showsVerticalScrollIndicator
                />
            </TableView>
            <Dialog.Container visible={isEntering}>
                <Dialog.Title>Add class</Dialog.Title>
                <Dialog.Description>
                Please enter the name of your custom assignment type
                </Dialog.Description>
                <Dialog.Input placeholder='Class Name' onChangeText={handleChange} />
                <Dialog.Button label="Cancel" onPress={handleCancel} />
                <Dialog.Button label="Add" bold onPress={handleAdd} color={(newItem==""||availableOptions.includes(newItem))?"gray":"#007ff9"} disabled={(newItem==""||availableOptions.includes(newItem))} />
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

export default UserDefinedSettings;