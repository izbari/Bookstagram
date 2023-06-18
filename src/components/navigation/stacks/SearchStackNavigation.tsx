import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../RouteNames';
import {NavigationParamsList} from '../NavigationParamsList';
import {Search} from '../../../use-cases/Search/Search';
const SearchStack = createNativeStackNavigator<NavigationParamsList>();
export const SearchStackNavigation: React.FunctionComponent = () => {
  return (
    <SearchStack.Navigator screenOptions={{headerShown: false}}>
      <SearchStack.Screen name={RouteNames.search} component={Search} />
    </SearchStack.Navigator>
  );
};
