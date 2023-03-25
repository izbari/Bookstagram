import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import EditProfile from '../../Pages/EditProfile';
import ProfileScreen from '../../Pages/Profile';
const ProfileStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: '#FF6EA1',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
        name="ProfileScreen"
        component={ProfileScreen}
      />
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
        component={EditProfile}
      />
    </Stack.Navigator>
  );
};
export default ProfileStack;
