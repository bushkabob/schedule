import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import redux from './redux/configureStore'
import { HomeHeaderLeft, HomeHeaderRight } from './HomeHeader';
import HomeScreen from './Home';
import SettingsScreen from './Settings'
import AddClass from "./ClassSettings"
import AddAssignmentNavigator from './Add Assingment/AddAssingmentNavigator';
import AddAssignmentType from "./AssignmentTypeSettings"
import AddAssignment from './Add Assingment/AddAssingment';
import SelectOptionScreen from './Add Assingment/SelectOptionScreen';
import ColorTheme from './ColorTheme';
import AddColorTheme from './AddColorTheme';
import SelectColor from './SelectColor';

const Stack = createNativeStackNavigator()

export default function App() {
  const store = redux()
  return (
    <Provider store={store.store}>
      <PersistGate persistor={store.persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Group>
              <Stack.Screen name='Home' component={HomeScreen} options={{
                headerRight: () => (<HomeHeaderRight/>),
                headerLeft: () => (<HomeHeaderLeft/>)
              }} />
              <Stack.Screen name='AddAssignment' component={AddAssignment} options={{title: "Edit Assignment"}} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="ColorTheme" component={ColorTheme} options={{title: "Color Theme"}} />
              <Stack.Screen name="AddColorTheme" component={AddColorTheme} options={{title: "Add Color Theme",}} />
              <Stack.Screen name="SelectColor" component={SelectColor} options={{title: "Select Color"}} />
              <Stack.Screen name="AddClass" component={AddClass} options={{title: "Edit Classes"}} />
              <Stack.Screen name="EditAssignmentTypes" component={AddAssignmentType} options={{ title: "Edit Assignment Types" }} />
              <Stack.Screen name="SelectListOption" component={SelectOptionScreen} />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: 'modal', headerShown: false }}>
              <Stack.Screen name="AddAssignmentNavigator" component={AddAssignmentNavigator}/>
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
    
  );
}

