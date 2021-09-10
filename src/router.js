import React, {Component} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import UserProvider from './context/Provider';

import Login from './Pages/Login';
import Profile from './Pages/Profile';
import Store from './Pages/Store';
import Library from './Pages/Library';
import AddTopics from './Pages/AddTopics';
import Favorites from './Pages/Favorites';
import Signup from './Pages/Signup';
import SingleBookDesc from './Pages/SingleBookDesc';
import MyTabBar from './components/TabBar';
import Discover from './Pages/Discover';
import deneme from './Pages/deneme';

import Onboarding from './Pages/Onboarding';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Main = () => {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      options={{headerShown: false}}>
      <Tab.Screen
        options={{headerShown: false}}
        name="Discover"
        component={Discover}
      />
      <Tab.Screen
        options={{headerShown: false}}
        name="deneme"
        component={deneme}
      />
      <Tab.Screen
        options={{headerShown: false}}
        name="Library"
        component={Library}
      />
      <Tab.Screen
        options={{headerShown: false}}
        name="Store"
        component={Store}
      />

      <Tab.Screen
        options={{headerShown: false}}
        name="Favorites"
        component={Favorites}
      />
      <Tab.Screen
        options={{headerShown: false}}
        name="Profile"
        component={Profile}
      />
      <Tab.Screen
        options={{headerShown: false}}
        name="Onboarding"
        component={Onboarding}
      />
    </Tab.Navigator>
  );
};
function App(props) {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator options={{headerShown: false}}>
          {/* <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Signup"
          component={Signup}
        />  */}
          <Stack.Screen
            options={{headerShown: false}}
            name="Main"
            component={Main}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="SingleBookDesc"
            component={SingleBookDesc}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="AddTopics"
            component={AddTopics}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
export default App;
