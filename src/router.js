import React, {Component} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/core';
import UserProvider from './context/Provider';
import {TouchableOpacity, Text} from 'react-native';
import Login from './Pages/Login';
import ProfileScreen from './Pages/Profile';
import EditProfile from './Pages/EditProfile';
import ChatScreen from './Pages/ChatScreen';
import ChatSingleScreen from './Pages/ChatSingleScreen';
import Store from './Pages/Store';
import Library from './Pages/Library';
import AddTopics from './Pages/AddTopics';
import Favorites from './Pages/Favorites';
import Signup from './Pages/Signup';
import SingleBookDesc from './Pages/SingleBookDesc';
import MyTabBar from './components/TabBar';
import Discover from './Pages/Discover';
import HomeScreen from './Pages/HomeScreen';
import NewMessage from './Pages/NewMessage';
import {Provider} from 'react-native-paper';

import Auth from './Pages/Auth';
import OtherProfile from './Pages/OtherProfile';

import CreatePost from './Pages/CreatePost';

import Onboarding from './Pages/Onboarding';
import Ionicons from 'react-native-vector-icons/Ionicons';

import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDoShg_mT8ediBrBP4bTHC4vGG2EM1bgpQ',

  authDomain: 'bookstagram-325020.firebaseapp.com',

  databaseURL: 'https://bookstagram-325020-default-rtdb.firebaseio.com',

  projectId: 'bookstagram-325020',

  storageBucket: 'bookstagram-325020.appspot.com',

  messagingSenderId: '464963021979',

  appId: '1:464963021979:web:73de2191c3f164423eaa3e',

  measurementId: 'G-HVJVK84ZM8',
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log("initializing app")
}else {
  firebase.app(); // if already initialized, use that one
  console.log("initializing app2")

}



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
const Chat = ({navigation}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerTitleAlign: 'center',
          title: 'Book Chat',
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
                navigation.navigate('NewMessage');
              }}>
              <Ionicons name="create-outline" size={25} color="white" />
            </TouchableOpacity>
          ),
        }}
        name="ChatScreen"
        component={ChatScreen}
      />
      <Stack.Screen
        options={{
          headerTitleAlign: 'center',
          title: 'New Message',
          headerStyle: {
            backgroundColor: '#FF6EA1',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
        name="NewMessage"
        component={NewMessage}
      />
      <Stack.Screen
        options={({route}) => ({
          title: route.params.name,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#FF6EA1',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        })}
        name="ChatSingleScreen"
        component={ChatSingleScreen}
      />
    </Stack.Navigator>
  );
};

const Main = props => {
  console.log("props",props)
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((user)=> {
      if(!user){
      props.navigation.navigate('AuthProvider')
      }
    })

    
  },[])
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      options={{headerShown: false}}>
      <Tab.Screen options={{headerShown: false}} name="Home" component={Home} />
      <Tab.Screen options={{headerShown: false}} name="Chat" component={Chat} />

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
        options={{
          headerTitleAlign: 'center',
          title: 'Store',
          headerStyle: {
            backgroundColor: '#FF6EA1',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Ionicons
                name="arrow-back-outline"
                size={30}
                color="white"
                style={{marginLeft: 15, marginRight: 5, marginTop: 5}}
              />
            </TouchableOpacity>
          ),
        }}
        name="Store"
        component={Store}
      />
      <Tab.Screen
        options={{
          headerTitleAlign: 'center',
          title: 'Favorites',
          headerStyle: {
            backgroundColor: '#FF6EA1',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Ionicons
                name="arrow-back-outline"
                size={30}
                color="white"
                style={{marginLeft: 15, marginRight: 5, marginTop: 5}}
              />
            </TouchableOpacity>
          ),
        }}
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
    <Stack.Screen
      options={{
        headerShown: false,
      }}
      name="Onboarding"
      component={Onboarding}
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
  </Stack.Navigator>
);

function App(props) {




  return (
    <UserProvider>
      <NavigationContainer>
        <Provider>
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
        </Provider>
      </NavigationContainer>
    </UserProvider>
  );
}
export default App;
