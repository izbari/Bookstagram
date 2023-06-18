import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {NavigationParamsList} from '../NavigationParamsList';
import {RouteNames} from '../RouteNames';
import {Chat} from '../../../use-cases/Chat/Chat';

const ChatStack = createNativeStackNavigator<NavigationParamsList>();
export const ChatStackNavigation: React.FunctionComponent = () => {
  return (
    <ChatStack.Navigator
      initialRouteName={RouteNames.chat}
      screenOptions={{headerShown: false}}>
      <ChatStack.Screen name={RouteNames.chat} component={Chat} />
    </ChatStack.Navigator>
  );
};
