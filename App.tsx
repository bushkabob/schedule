import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import redux from './redux/configureStore'
import { HomeHeaderLeft, HomeHeaderRight } from './HomeHeader';
import AddAssingment from './AddAssingment';
import HomeScreen from './Home';
import SettingsScreen from './Settings'
import AddClass from "./ClassSettings"
import SelectOptionScreen from './SelectOptionScreen';

const Stack = createNativeStackNavigator()

export default function App() {
  const store = redux()
  return (
    <Provider store={store.store}>
      <PersistGate persistor={store.persistor}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name='Home' component={HomeScreen} options={{
              headerRight: () => (<HomeHeaderRight/>),
              headerLeft: () => (<HomeHeaderLeft/>)
            }} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="AddAssingment" component={AddAssingment} options={{title: "Add Assingment"}}/>
            <Stack.Screen name="AddClass" component={AddClass} options={{title: "Edit Classes"}}/>
            <Stack.Screen name="SelectListOption" component={SelectOptionScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
    
  );
}

