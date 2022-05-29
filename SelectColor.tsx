/*import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Button, View, StyleSheet } from "react-native"
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { SelectColorProps, SelectedColorReturnRouteProps } from "./types";

const SelectColor = () => {
    const route = useRoute<SelectedColorReturnRouteProps>()
    const { selectedColor, index } = route.params
    const navigation = useNavigation<SelectColorProps>()
    const [color, updateColor] = useState(selectedColor)
    navigation.setOptions({
        headerRight: () => (
            <Button title="Save" onPress={() => {navigation.navigate("AddColorTheme", { selectedColor: selectedColor, index: index })}} />
        )
    })

    return (
        <SafeAreaView style={[styles.container, styles.shadows]}>
            <TextInput 
                style={[styles.mainItem, styles.shadows]} 
                textAlign="center" 
                value={color}
                onChangeText={(text) => updateColor(text)}
            />
            <View style={[styles.mainItem, styles.shadows, {flexDirection: "row", alignItems: "center", justifyContent: "center"}]}>
                <Button title={"Update"} onPress={()=>updateColor(color)} />
            </View>
            <View style={{flex: 1, marginHorizontal: 10}}>
                
            </View>
        </SafeAreaView>
    )
}
//
//color={color} 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        marginTop: 20, 
        marginBottom: 30, 
        marginHorizontal: 15, 
        borderRadius: 30
    },
    shadows: {
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.8, 
        shadowRadius: 2
    },
    mainItem: {
        alignSelf: "center", 
        backgroundColor: "white", 
        width: 200, 
        height: 50, 
        fontSize: 20, 
        borderRadius: 30
    }
})

export default SelectColor;*/

import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  LogBox,
  Button,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import {
  HueSlider,
  SaturationSlider,
  LightnessSlider
} from 'react-native-color';
import { TextInput } from 'react-native-gesture-handler';
import tinycolor from 'tinycolor2';
import { AddColorThemeProps, SelectColorProps, SelectedColorReturnRouteProps } from './types';

const SelectColor = () => {
    const route = useRoute<SelectedColorReturnRouteProps>()
    const color = tinycolor(route.params.selectedColor).toHsl()
    const navigation = useNavigation<AddColorThemeProps>()

    navigation.setOptions({
        headerRight: () => (
            <Button title="Save" onPress={() => {navigation.navigate("AddColorTheme", { selectedColor: tinycolor({h: hue, s: saturation, l: lightness}).toHexString(), index: route.params.index, name: route.params.name })}} />
        )
    })
    const [hue, setHue] = useState(color.h);
    const [saturation, setSaturation] = useState(color.s);
    const [lightness, setLightness] = useState(color.l);
    const updatedColor = tinycolor({h: hue, s: saturation, l: lightness}).toHsl()
    const colorHex = tinycolor(updatedColor).toHexString()
    const [colorText, setColorText] = useState(colorHex)

    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }, [])

    const updateTextColor = (h: number, s: number, l: number) => {
        const color = tinycolor({h: h, s: s, l: l}).toHexString()
        setColorText(color)
    }

    const updateHslColor = (hex: string) => {
        const color = tinycolor(hex).toHsl()
        setHue(color.h)
        setSaturation(color.s)
        setLightness(color.l)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, styles.shadow]}>
                <View style={[styles.centerItem, styles.shadow, {backgroundColor: "white"}]}  >
                    <TextInput 
                        style={{flex: 1, fontSize: 20, width: "100%", textAlign: "center"}}
                        value={colorText} 
                        onChangeText={(text)=>{
                            text.length > 0 && text.length < 8 && text.substring(0,1) === "#" && setColorText(text)
                            text.length === 7 && updateHslColor(text)
                        }}  
                    />
                </View >
                <View style={[{backgroundColor: tinycolor(updatedColor).toHexString()}, styles.shadow, styles.centerItem]} />
                <HueSlider
                    style={styles.sliderRow}
                    gradientSteps={255}
                    value={hue}
                    onValueChange={(val: number) => {
                        setHue(val)
                        updateTextColor(val, saturation, lightness)
                    }}
                />
                <SaturationSlider
                    style={styles.sliderRow}
                    gradientSteps={100}
                    value={saturation}
                    color={updatedColor}
                    onValueChange={(val: number) => {
                        setSaturation(val) 
                        updateTextColor(hue, val, lightness)
                    }}
                />
                <LightnessSlider
                    style={styles.sliderRow}
                    gradientSteps={100}
                    value={lightness}
                    color={updatedColor}
                    onValueChange={(val: number) => {
                        setLightness(val)
                        updateTextColor(hue, saturation, val)
                    }}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}

export default SelectColor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 30,
    borderRadius: 30
  },
  sliderRow: {
    alignSelf: 'center',
    marginTop: 12,
    width: "90%"
  },
  shadow: {
    shadowColor: '#000', 
    margin: 3, 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.8, 
    shadowRadius: 2
  },
  centerItem: {
      marginTop: 30,
      alignSelf: "center",
      alignItems: "center",
      height: 50,
      width: "75%",
      borderRadius: 30,
  }
});