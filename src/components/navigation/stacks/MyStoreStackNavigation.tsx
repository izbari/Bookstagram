import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {NavigationParamsList} from '../NavigationParamsList';
import {RouteNames} from '../RouteNames';
import {MyStore} from '../../../use-cases/MyStore/MyStore';
import {ProductInfo} from '../../../use-cases/MyStore/ProductInfo';
import {SellNow} from '../../../use-cases/MyStore/SellNow';
import {SelectCategory} from '../../../use-cases/MyStore/SelectCategory';

const MyStoreStack = createNativeStackNavigator<NavigationParamsList>();
export const MyStoreStackNavigation: React.FunctionComponent = () => {
  return (
    <MyStoreStack.Navigator
      initialRouteName={RouteNames.myStoreStack}
      screenOptions={{headerShown: false, animation: 'slide_from_left'}}>
      <MyStoreStack.Screen name={RouteNames.myStore} component={MyStore} />
      <MyStoreStack.Screen
        name={RouteNames.productInfo}
        component={ProductInfo}
      />
      <MyStoreStack.Screen name={RouteNames.sellNow} component={SellNow} />
      <MyStoreStack.Screen
        name={RouteNames.selectCategory}
        component={SelectCategory}
      />
    </MyStoreStack.Navigator>
  );
};
