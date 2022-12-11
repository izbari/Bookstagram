import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StoreScreen from '../../Pages/Store';
const Stack = createNativeStackNavigator();
const StoreStack = () => {
  const options = {headerShown: false};
  return (
    <Stack.Navigator options={options}>
      <Stack.Screen
        name="StoreScreen"
        component={StoreScreen}
        options={options}
      />
    </Stack.Navigator>
  );
};

export default StoreStack;

const styles = StyleSheet.create({});
