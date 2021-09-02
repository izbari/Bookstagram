import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from './Pages/Login';
import Home from './Pages/Home';

const Stack = createNativeStackNavigator();



 function App(props) {
  return (
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;