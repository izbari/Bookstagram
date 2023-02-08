import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MyStoreScreen from '../../Pages/MyStoreScreen';
import React from 'react';
import StoreTabScreen from '../../Pages/MyStoreTabs/StoreTabScreen';
import FavoritesTabScreen from '../../Pages/MyStoreTabs/FavoritesTabScreen';
import SoldTabScreen from '../../Pages/MyStoreTabs/SoldTabScreen';
import colors from '../../constants/colors';

const Tab = createMaterialTopTabNavigator();

const MyStoreTab = () => {
  return (
    <>
      <MyStoreScreen />
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: {fontSize: 13, textTransform:'none', fontWeight:'500'},
          tabBarActiveTintColor: colors.darkPurple,
          tabBarIndicatorStyle: {backgroundColor: colors.darkPurple},
          tabBarPressColor: 'white'
        }}>
        <Tab.Screen name="My Store" component={StoreTabScreen} />
        <Tab.Screen name="Favorites" component={FavoritesTabScreen} />
        <Tab.Screen name="Sold" component={SoldTabScreen} />
      </Tab.Navigator>
    </>
  );
};
export default MyStoreTab;
