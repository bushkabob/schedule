import { ColorThemeData } from "./redux/colorThemeSlice"
import { useTheme } from "./Theme/ThemeProvider"
import { View, Text, StyleSheet, ListRenderItem, BackHandler } from "react-native"
import React, { useCallback, useMemo } from "react"
import { getColor } from "./utils"
import { FlatList, TouchableOpacity } from "react-native-gesture-handler"

interface WeekRowProps {
    dates: (Date | null)[];
    isSelected: boolean[];
    currentDate: Date,
    activeIndicies: number[][],
    setSelectedDate: (date: string) => void
}

const WeekRow = (props: WeekRowProps & {theme: ColorThemeData}) => {
    const renderItem: ListRenderItem<Date | null> = ({ item, index }) => {
        const date = item
        const isSelected = props.isSelected[index]
        return callbackRender(date, isSelected, index)
    }

    const callbackRender = useCallback((date: Date | null, isSelected: boolean, index: number) => {
        console.log(date)
        return (
            <TouchableOpacity onPress={() => {if(date !== null){props.setSelectedDate(date!.toDateString())}}} >
                <View>
                    <View style={{flexGrow: 1}}>
                        <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', aspectRatio: 1, borderRadius: 60}, isSelected?{backgroundColor: systemColors.red}:{}]}>
                            <Text style={[styles.calendarTitle, {color:isSelected?"white":systemColors.textColor}]} key={date!==null?date.getDate():index}>{date!==null?date.getDate():""}</Text>
                        </View>
                    </View>
                    <View>
                        <View style={{justifyContent: "center", alignItems: "center", paddingTop: 3}}>
                                <View style={{flexDirection: "row", height: circleHeight, justifyContent: "center", margin: 1, width: circleHeight*6}}>
                                    {props.activeIndicies[index].slice(0,4).map((colorIndex) => {
                                        return <View key={colorIndex} style={{height: circleHeight, width: circleHeight, marginHorizontal: 1, borderRadius: 60, backgroundColor: getColor(colorIndex, props.theme.colors)}} />
                                    })
                                    }
                                </View>
                                <View style={{flexDirection: "row", height: circleHeight, margin: 1, justifyContent: "center", width: circleHeight*6}}>
                                    {props.activeIndicies[index].slice(4,8).map((colorIndex) => {
                                        return <View key={colorIndex} style={{height: circleHeight, width: circleHeight, marginHorizontal: 1, borderRadius: 60, backgroundColor: getColor(colorIndex, props.theme.colors)}} />
                                    })
                                    }
                                </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }, [])

    const keyExtractor = useCallback((_, index) => index, [])

    const systemColors = useTheme()
    const circleHeight = 5;
    return (
        <View style={[styles.calendarTitleRow]}>
            <FlatList contentContainerStyle={{width: "100%"}} numColumns={7} keyExtractor={keyExtractor} data={props.dates} renderItem={renderItem}/>
        </View>
    );
}

export default React.memo(WeekRow)

const styles = StyleSheet.create({
    container: {
      width: "100%",
    },
    calendarView: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      flexDirection: "column",
    },
    calendarTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 10,
        width: "100%",
    },
    calendarTitle: {
        textAlign: 'center',
    },
    calendarListView: {
        flex: 1,
        width: '100%',
    },
});