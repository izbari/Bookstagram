import React, {Component} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import UserProvider from './context/Provider';
import {TouchableOpacity, Text} from 'react-native';
import Login from './Pages/Login';
import ProfileScreen from './Pages/Profile';
import EditProfile from './Pages/EditProfile';

import Store from './Pages/Store';
import Library from './Pages/Library';
import AddTopics from './Pages/AddTopics';
import Favorites from './Pages/Favorites';
import Signup from './Pages/Signup';
import SingleBookDesc from './Pages/SingleBookDesc';
import MyTabBar from './components/TabBar';
import Discover from './Pages/Discover';
import HomeScreen from './Pages/HomeScreen';
import Post from './Pages/Post';
import Auth from './Pages/Auth';
import OtherProfile from './Pages/OtherProfile';

import CreatePost from './Pages/CreatePost';

import Onboarding from './Pages/Onboarding';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Profile = props => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ProfileScreen"
        component={ProfileScreen}></Stack.Screen>
      <Stack.Screen
        options={{
          headerTitleAlign: 'center',
          title: 'Edit Profile',
          headerStyle: {
            backgroundColor: '#FF6EA1',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
        name="EditProfile"
        component={EditProfile}></Stack.Screen>
    </Stack.Navigator>
  );
};
const Main = props => {
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      options={{headerShown: false}}>
      <Tab.Screen options={{headerShown: false}} name="Home" component={Home} />
      <Tab.Screen
        options={{headerShown: false}}
        name="Discover"
        component={Discover}
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
    </Tab.Navigator>
  );
};
const Home = props => (
  <Stack.Navigator>
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="Auth"
      component={Auth}
    />
    <Stack.Screen
      options={{
        headerTitleAlign: 'center',
        title: 'Bookstagram',
        headerStyle: {
          backgroundColor: '#FF6EA1',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('CreatePost');
            }}>
            <Ionicons name="add" size={35} color="white" />
          </TouchableOpacity>
        ),
      }}
      name="HomeScreen"
      component={HomeScreen}
    />
    <Stack.Screen
      options={{
        headerTitleAlign: 'center',
        title: 'Create your feed',
        headerStyle: {
          backgroundColor: '#FF6EA1',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
      }}
      name="CreatePost"
      component={CreatePost}
    />
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="OtherProfile"
      component={OtherProfile}
    />
  </Stack.Navigator>
);
const AuthProvider = props => (
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
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="Onboarding"
      component={Onboarding}
    />
  </Stack.Navigator>
);

function App(props) {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator options={{headerShown: false}}>
          <Stack.Screen
            options={{headerShown: false}}
            name="Main"
            component={Main}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="AuthProvider"
            component={AuthProvider}
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
