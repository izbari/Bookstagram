import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from './RouteNames';
import {NavigationParamsList} from './NavigationParamsList';
import {MainStackNavigation} from './MainStackNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {Login} from '../../use-cases/Auth/Login';
import {Register} from '../../use-cases/Auth/Register';
import {useAuth} from '../../infrastructure/Utils/useAuth';
import {ActivityIndicator} from 'react-native';

const RootStack = createNativeStackNavigator<NavigationParamsList>();

export const RootStackNavigation: React.FunctionComponent = () => {
  const {isLoading, isLoggedIn} = useAuth();

  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={RouteNames.main}
        screenOptions={{headerShown: false}}>
        {isLoggedIn ? (
          <RootStack.Screen
            name={RouteNames.main}
            component={MainStackNavigation}
          />
        ) : (
          <>
            <RootStack.Screen name={RouteNames.login} component={Login} />
            <RootStack.Screen name={RouteNames.register} component={Register} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
