import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import FavoriteScreen from '../../Pages/Favorites';
const Stack = createNativeStackNavigator();
const FavoriteStack = () => {
  const options = {headerShown: false};
  return (
    <Stack.Navigator options={options}>
      <Stack.Screen
        name="FavoriteScreen"
        component={FavoriteScreen}
        options={options}
      />
    </Stack.Navigator>
  );
};

export default FavoriteStack;

const styles = StyleSheet.create({});
