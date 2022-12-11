import React from 'react';
import {StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LibraryScreen from '../../Pages/Library'
const Stack = createNativeStackNavigator();
const LibraryStack = () => {
  const options = {headerShown: false};
  return (
    <Stack.Navigator options={options}>
      <Stack.Screen
        name="LibraryScreen"
        component={LibraryScreen}
        options={options}
      />
    </Stack.Navigator>
  );
};

export default LibraryStack;

const styles = StyleSheet.create({});
