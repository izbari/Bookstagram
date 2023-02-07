import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {View, Text} from 'react-native';
import MyStoreScreen from '../../Pages/MyStoreScreen';
import React from 'react';

const Tab = createMaterialTopTabNavigator();

function BookStoreTab() {
  return (
    <View style={{flex: 1}}>
      <Text>Book Store</Text>
    </View>
  );
}
function FavoritesTab() {
  return (
    <View style={{flex: 1}}>
      <Text>Favorites</Text>
    </View>
  );
}
function SaledTab() {
  return (
    <View style={{flex: 1}}>
      <Text>Saled</Text>
    </View>
  );
}
const MyStoreTab = () => {
  return (
    <>
      <MyStoreScreen />
      <Tab.Navigator>
        <Tab.Screen name="Book Store" component={BookStoreTab} />
        <Tab.Screen name="Favorites" component={FavoritesTab} />
        <Tab.Screen name="Saled" component={SaledTab} />
      </Tab.Navigator>
    </>
  );
};
export default MyStoreTab;
