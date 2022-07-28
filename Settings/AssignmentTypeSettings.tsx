import { View, StyleSheet, TouchableOpacity, Appearance } from 'react-native'
import { Cell, TableView, Separator } from 'react-native-tableview-simple';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import Dialog from 'react-native-dialog'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux';
import { addAssignmentType, removeAssignmentType, reorderAssignmentTypes } from '../redux/assignmentTypeSlice';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { useTheme } from '../Theme/ThemeProvider';

const RightAction = () => (
    <View style={{backgroundColor: "red", width: "100%", alignItems: "flex-end", justifyContent: "center", padding: 10}}>
        <Ionicons name='trash-outline' color={"white"} size={24} />
    </View>
)

interface HeaderRightProps {
    updateEnteringClass: (value: React.SetStateAction<boolean>) => void
}

const UserDefinedSettings = () => {
    //const [classes, updateClasses] = useState<string[]>([]);
    const availableOptions = useSelector((state: RootState) => state.assignmentTypes)
    const dispatch = useDispatch()
    const [isEntering, updateEntering] = useState(false);
    const [newItem, updateNewItem] = useState("");
    const navigation = useNavigation()
    const systemColors = useTheme()

    const HeaderRight = (props: HeaderRightProps) => {
        return (
            <TouchableOpacity onPress={() => {props.updateEnteringClass(true)}}>
                <Ionicons name="add" color={systemColors.textColor} size={32}/>
            </TouchableOpacity>
        )
    }

    const renderRow = (item: string, index: number | undefined, drag: ()=>void, isActive: boolean): JSX.Element => {
        return (
            <ScaleDecorator>
                <Swipeable hitSlop={{"left":-50}} key={item} renderRightActions={RightAction} onSwipeableOpen={()=>dispatch(removeAssignmentType({ name: item }))}>
                    <Cell title={item} cellAccessoryView={<Ionicons onLongPress={drag} name="reorder-three-outline" size={24} color={Appearance.getColorScheme()==="light"?"black":"white"}/>} />
                </Swipeable>
                {typeof index !== "undefined" && index < availableOptions.length-1 && <Separator isHidden={isActive} />}
            </ScaleDecorator>
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
                <DraggableFlatList
                    data={availableOptions}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, drag, isActive, index }) => (renderRow(item, index, drag, isActive))}
                    style={{ height: "100%" }}
                    onDragEnd={({ data }) => dispatch(reorderAssignmentTypes(data))}
                    dragHitSlop={{left: -50}}
                    ListFooterComponent={<View></View>}
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