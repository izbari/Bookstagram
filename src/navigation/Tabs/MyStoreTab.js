import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MyStoreScreen from '../../Pages/MyStoreScreen';
import React from 'react';
import StoreTabScreen from '../../Pages/MyStoreTabs/StoreTabScreen';
import FavoritesTabScreen from '../../Pages/MyStoreTabs/FavoritesTabScreen';
import SaledTabScreen from '../../Pages/MyStoreTabs/SaledTabScreen';

const Tab = createMaterialTopTabNavigator();

const MyStoreTab = () => {
  return (
    <>
      <MyStoreScreen />
      <Tab.Navigator>
        <Tab.Screen name="My Store" component={StoreTabScreen} />
        <Tab.Screen name="Favorites" component={FavoritesTabScreen} />
        <Tab.Screen name="Saled" component={SaledTabScreen} />
      </Tab.Navigator>
    </>
  );
};
export default MyStoreTab;
