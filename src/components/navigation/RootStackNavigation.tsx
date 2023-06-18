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
import {CreatePost} from '../../use-cases/CreatePost/CreatePost';
import {SinglePost} from '../../use-cases/Landing/SinglePost';
import { ProductInfo } from '../../use-cases/MyStore/ProductInfo';
import { Store } from '../../use-cases/MyStore/Store';

const RootStack = createNativeStackNavigator<NavigationParamsList>();

export const RootStackNavigation: React.FunctionComponent = () => {
  const {isLoading, isLoggedIn} = useAuth();

  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={RouteNames.store}
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
        <RootStack.Screen
          name={RouteNames.createPost}
          component={CreatePost}
          options={{
            gestureEnabled: false,
            presentation: 'fullScreenModal',
          }}
        />
        <RootStack.Screen name={RouteNames.singlePost} component={SinglePost} />
        <RootStack.Screen name={RouteNames.productInfo} component={ProductInfo} />
        <RootStack.Screen name={RouteNames.store} component={Store} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
