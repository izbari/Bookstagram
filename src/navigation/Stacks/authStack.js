import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from '../../Pages/Login';
import Signup from '../../Pages/Signup';
const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Signup"
        component={Signup}
      />
    </Stack.Navigator>
  );
};
export default AuthStack;
