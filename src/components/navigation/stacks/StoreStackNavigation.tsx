import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {NavigationParamsList} from '../NavigationParamsList';
import {RouteNames} from '../RouteNames';
import {MyStore} from '../../../use-cases/MyStore/MyStore';
import {SelectCategory} from '../../../use-cases/MyStore/SelectCategory';
import {Store} from '../../../use-cases/MyStore/Store';

const StoreStack = createNativeStackNavigator<NavigationParamsList>();
export const StoreStackNavigation: React.FunctionComponent = () => {
  return (
    <StoreStack.Navigator
      initialRouteName={RouteNames.store}
      screenOptions={{headerShown: false, animation: 'slide_from_left'}}>
      <StoreStack.Screen name={RouteNames.myStore} component={MyStore} />
      <StoreStack.Screen
        name={RouteNames.selectCategory}
        component={SelectCategory}
      />
      <StoreStack.Screen name={RouteNames.store} component={Store} />
    </StoreStack.Navigator>
  );
};
