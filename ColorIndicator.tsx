import { StyleProp, View, ViewStyle, StyleSheet } from "react-native";

interface ColorIndicatorProps {
    color: string
    style?: StyleProp<ViewStyle>
}

const ColorIndicator = (props: ColorIndicatorProps) => {
    return (
        <View style={[{backgroundColor: props.color}, styles.colorIndicator, props.style]} />
    )
}

const styles = StyleSheet.create({
    colorIndicator: {
        borderRadius: 60, 
        aspectRatio: 1, 
        height: 25, 
        alignSelf: "center"
    }
})

export default ColorIndicator;