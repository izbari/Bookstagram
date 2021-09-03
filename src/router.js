import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import Store from './Pages/Store';
import Library from './Pages/Library';
import Discover from './Pages/Discover';
import Favorites from './Pages/Favorites';
import Signup from './Pages/Signup';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();



const Main = () => {
  return(
  <Tab.Navigator >
        <Tab.Screen name="Store" component={Store} />
        <Tab.Screen name="Profile" component={Profile} />

        <Tab.Screen name="Library" component={Library} />
        <Tab.Screen name="Favorites" component={Favorites} />

    <Tab.Screen name="Discover" component={Discover} />
</Tab.Navigator >
)
}
function App(props) {
  return (
    <NavigationContainer >
      <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
     <Stack.Screen name="Main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;