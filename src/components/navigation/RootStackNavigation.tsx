import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from './RouteNames';
import {NavigationParamsList} from './NavigationParamsList';
import {MainStackNavigation} from './MainStackNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {Login} from '../../use-cases/Auth/Login';
import {Register} from '../../use-cases/Auth/Register';
import {useAuth} from '../../infrastructure/Utils/useAuth';
import {ActivityIndicator, Text, View} from 'react-native';
import {CreatePost} from '../../use-cases/CreatePost/CreatePost';
import {SinglePost} from '../../use-cases/Landing/SinglePost';
import { ProductInfo } from '../../use-cases/MyStore/ProductInfo';
import { Store } from '../../use-cases/MyStore/Store';
import auth from '@react-native-firebase/auth';
import {SingleChat} from '../../use-cases/Chat/SingleChat';
import {CreateChat} from '../../use-cases/Chat/CreateChat';
import {
  DrawerNavigator,
  DrawerStackNavigation,
} from './stacks/DrawerNavigation';
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ChatStackNavigation} from './stacks/ChatStackNavigation';
import {LandingStackNavigation} from './stacks/LandingStackNavigation';
const RootStack = createNativeStackNavigator<NavigationParamsList>();
const Drawer = createDrawerNavigator();

export const RootStackNavigation: React.FunctionComponent = () => {
  const {isLoading} = useAuth();
  const user = auth().currentUser;

  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName={RouteNames.landing}
        screenOptions={{headerShown: false}}>
        {user ? (
          <Drawer.Screen
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
        <RootStack.Screen
          name={RouteNames.chat}
          component={ChatStackNavigation}
        />
        <RootStack.Screen name={RouteNames.singlePost} component={SinglePost} />
        <RootStack.Screen name={RouteNames.productInfo} component={ProductInfo} />
        <RootStack.Screen name={RouteNames.store} component={Store} />
        <RootStack.Screen name={RouteNames.singleChat} component={SingleChat} />
        <RootStack.Screen name={RouteNames.createChat} component={CreateChat} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
