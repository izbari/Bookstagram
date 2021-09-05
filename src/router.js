import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
  return (
    <Tab.Navigator options={{headerShown: false}}>
      <Tab.Screen
        options={{headerShown: false}}
        options ={{tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="earth" color='blue' size={size} />
        ),}}
        name="Discover"
        component={Discover}
      />
      <Tab.Screen
        options={{headerShown: false}}
        options ={{tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="cart" color='blue' size={size} />
        ),}}
        name="Store"
        component={Store}
      />
      <Tab.Screen
        options={{headerShown: false}}
        options ={{tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color='blue' size={size} />
        ),}}
        name="Profile"
        component={Profile}
      />
      <Tab.Screen
        options={{headerShown: false}}
        options ={{tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="library" color='blue' size={size} />
        ),}}
        name="Library"
        component={Library}
      />
      <Tab.Screen
        options={{headerShown: false}}
        options ={{tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="heart" color='red' size={size} />
        ),}}
        name="Favorites"
        component={Favorites}
      />
    </Tab.Navigator>
  );
};
function App(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator options={{headerShown: false}}>
         <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Signup"
          component={Signup}
        /> 
        <Stack.Screen
          options={{headerShown: false}}
          name="Main"
          component={Main}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
