import React, { createContext } from 'react';
import { ColorSchemeName } from 'react-native';
import {lightColors, darkColors} from './colorThemes';

const ThemeContext = createContext(lightColors);

type ThemeContextProvider = {
    colorTheme: ColorSchemeName,
    children: React.ReactNode;
}

export const ThemeContextProvider = (props: ThemeContextProvider) => {

    const colors = props.colorTheme === "dark" ? darkColors : lightColors
    return (
            <ThemeContext.Provider value={{...colors, ...{}}}>
                {props.children}
            </ThemeContext.Provider>
        );
};

// Custom hook to get the theme object returns {isDark, colors, setScheme}
export const useTheme = () => React.useContext(ThemeContext);