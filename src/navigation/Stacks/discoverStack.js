import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DiscoverScreen from '../../Pages/Discover';

const Stack = createNativeStackNavigator();
const DiscoverStack = () => {
  const options = {headerShown: false};
  return (
    <Stack.Navigator options={options}>
      <Stack.Screen
        name="DiscoverScreen"
        component={DiscoverScreen}
        options={options}
      />
    </Stack.Navigator>
  );
};

export default DiscoverStack;

const styles = StyleSheet.create({});
