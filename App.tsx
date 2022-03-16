import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Home';
import { HomeHeaderLeft, HomeHeaderRight } from './HomeHeader';

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name='Home' component={HomeScreen} options={{
            headerRight: () => (<HomeHeaderRight/>),
            headerLeft: () => (<HomeHeaderLeft/>)
          }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

