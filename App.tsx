import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import redux from './redux/configureStore'
import { AndroidHomeHeaderRight, HomeHeaderLeft, HomeHeaderRight } from './HomeHeader';
import HomeScreen from './Home';
import SettingsScreen from './Settings/Settings'
import AddClass from "./Settings/ClassSettings"
import AddAssignmentNavigator from './Add Assingment/AddAssingmentNavigator';
import AddAssignmentType from "./Settings/AssignmentTypeSettings"
import AddAssignment from './Add Assingment/AddAssingment';
import SelectOptionScreen from './Add Assingment/SelectOptionScreen';
import ColorTheme from './Theme/ColorTheme';
import AddColorTheme from './Theme/AddColorTheme';
import SelectColor from './Theme/SelectColor';
import { ThemeContextProvider, useTheme } from './Theme/ThemeProvider';
import { useColorScheme, Platform, View } from 'react-native';
import CalendarNavigator from './CalendarNavigator';

const Stack = createNativeStackNavigator()
export const store = redux()

export default function App() {
  const colorScheme = useColorScheme()
  return (
    <Provider store={store.store}>
      <PersistGate persistor={store.persistor}>
        <ThemeContextProvider colorTheme={colorScheme}>
          <MainApp />
        </ThemeContextProvider>
      </PersistGate>
    </Provider>
    
  );
}

const MainApp = () => {
  const scheme = useTheme()
  //SystemUI.setBackgroundColorAsync(scheme.mode==="dark"?"black":"white")
  console.log(scheme)
  return (
    <NavigationContainer theme={scheme.mode === 'dark' ? DarkTheme : DefaultTheme} >
      <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='Home' component={HomeScreen} options={{
            headerRight: () => (Platform.OS !== "android" ? <HomeHeaderRight/> : <AndroidHomeHeaderRight/>),
            headerLeft: () =>  (Platform.OS !== "android" ? <HomeHeaderLeft/> : <View/>)
          }} />
          <Stack.Screen name='AddAssignment' component={AddAssignment} options={{title: "Edit Assignment"}} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="ColorTheme" component={ColorTheme} options={{title: "Color Theme"}} />
          <Stack.Screen name="EditColorTheme" component={AddColorTheme} options={{title: "Add Color Theme",}} />
          <Stack.Screen name="SelectColor" component={SelectColor} options={{title: "Select Color"}} />
          <Stack.Screen name="AddClass" component={AddClass} options={{title: "Edit Classes"}} />
          <Stack.Screen name="EditAssignmentTypes" component={AddAssignmentType} options={{ title: "Edit Assignment Types" }} />
          <Stack.Screen name="SelectListOption" component={SelectOptionScreen} />
          <Stack.Screen name="AddAssignmentNavigator" options={{presentation: 'modal', headerShown: false}} component={AddAssignmentNavigator}/>
          <Stack.Group>
            <Stack.Screen name="CalendarNavigator" options={{presentation: 'modal', headerShown: false}}  component={CalendarNavigator}/>
          </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  )
}