import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {NavigationParamsList} from '../NavigationParamsList';
import {RouteNames} from '../RouteNames';
import {Profile} from '../../../use-cases/Profile/Profile';
import {ProfileSettings} from '../../../use-cases/Profile/ProfileSettings';

const ProfileStack = createNativeStackNavigator<NavigationParamsList>();
export const ProfileStackNavigation: React.FunctionComponent = () => {
  return (
    <ProfileStack.Navigator
      initialRouteName={RouteNames.profileMain}
      screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name={RouteNames.profileMain} component={Profile} />
      <ProfileStack.Screen name={RouteNames.profileSettings} component={ProfileSettings} />



    </ProfileStack.Navigator>
  );
};
