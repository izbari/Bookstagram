import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {NavigationParamsList} from '../NavigationParamsList';
import {RouteNames} from '../RouteNames';
import {Profile} from '../../../use-cases/Profile/Profile';
import {MyStore} from '../../../use-cases/MyStore/MyStore';

const ProfileStack = createNativeStackNavigator<NavigationParamsList>();
export const ProfileStackNavigation: React.FunctionComponent = () => {
  return (
    <ProfileStack.Navigator
      initialRouteName={RouteNames.profile}
      screenOptions={{headerShown: false}}>
      <ProfileStack.Screen name={RouteNames.profile} component={Profile} />
      <ProfileStack.Screen name={RouteNames.store} component={MyStore} />
    </ProfileStack.Navigator>
  );
};
