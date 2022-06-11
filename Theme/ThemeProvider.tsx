import React, { createContext, useCallback, useEffect } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native';
import {lightColors, darkColors} from './colorThemes';

const ThemeContext = createContext({
    isDark: false,
});

type ThemeContextProvider = {
    colorTheme: ColorSchemeName,
    children: React.ReactNode;
}

export const ThemeContextProvider = (props: ThemeContextProvider) => {

  return (
        <ThemeContext.Provider value={{isDark: props.colorTheme === "dark"}}>
            {props.children}
        </ThemeContext.Provider>
    );
};

// Custom hook to get the theme object returns {isDark, colors, setScheme}
export const useTheme = () => React.useContext(ThemeContext);