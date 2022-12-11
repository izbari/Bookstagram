import {TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import React from 'react';
import Icon from '../../components/Icons';
import HomeScreen from '../../Pages/HomeScreen';
import OtherProfile from '../../Pages/OtherProfile';
import CreatePost from '../../Pages/CreatePost';
const HomeStack = ({navigation}) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
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
                navigation.navigate('CreatePost');
              }}>
              <Icon name="Add" size={35} fill="white" />
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
};
export default HomeStack;
