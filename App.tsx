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
            <Stack.Group>
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="AddClass" component={AddClass} options={{title: "Edit Classes"}}/>
              <Stack.Screen name="EditAssignmentTypes" component={AddAssignmentType} options={{ title: "Edit Assignment Types" }} />
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

