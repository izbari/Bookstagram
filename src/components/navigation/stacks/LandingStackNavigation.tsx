import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {NavigationParamsList} from '../NavigationParamsList';
import {RouteNames} from '../RouteNames';
import {Landing} from '../../../use-cases/Landing/Landing';
import {SinglePost} from '../../../use-cases/Landing/SinglePost';

const LandingStack = createNativeStackNavigator<NavigationParamsList>();
export const LandingStackNavigation: React.FunctionComponent = () => {
  return (
    <LandingStack.Navigator
      initialRouteName={RouteNames.landingMain}
      screenOptions={{headerShown: false}}>
      <LandingStack.Screen name={RouteNames.landingMain} component={Landing} />
    </LandingStack.Navigator>
  );
};
