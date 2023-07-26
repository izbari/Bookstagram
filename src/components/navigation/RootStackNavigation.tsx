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
import {ProductInfo} from '../../use-cases/MyStore/ProductInfo';
import {Store} from '../../use-cases/MyStore/Store';
import auth from '@react-native-firebase/auth';
import {SingleChat} from '../../use-cases/Chat/SingleChat';
import {CreateChat} from '../../use-cases/Chat/CreateChat';

import {createDrawerNavigator} from '@react-navigation/drawer';
import {ChatStackNavigation} from './stacks/ChatStackNavigation';
import {CustomDrawerContent} from './CustomDrawerContent';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import {StoreStackNavigation} from './stacks/StoreStackNavigation';
import {BookBottomTab} from './BookBottomTab';
import {ProfileStackNavigation} from './stacks/ProfileStackNavigation';
const RootStack = createNativeStackNavigator<NavigationParamsList>();
const Drawer = createDrawerNavigator();

export const RootStackNavigation: React.FunctionComponent = () => {
  const {isLoading, isLoggedIn} = useAuth();
  console.warn('isLoggedIn', isLoggedIn);
  const isInBookTab = useAppSelector(state => state.user.isInBookTab);
  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        initialRouteName={RouteNames.landing}
        screenOptions={{headerShown: false}}>
        {isLoggedIn ? (
          isInBookTab ? (
            <Drawer.Screen name={RouteNames.book} component={BookBottomTab} />
          ) : (
            <Drawer.Screen
              name={RouteNames.main}
              component={MainStackNavigation}
            />
          )
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
        <RootStack.Screen
          name={RouteNames.productInfo}
          component={ProductInfo}
        />
        <RootStack.Screen name={RouteNames.store} component={Store} />
        <RootStack.Screen name={RouteNames.singleChat} component={SingleChat} />
        <RootStack.Screen name={RouteNames.createChat} component={CreateChat} />
        <RootStack.Screen
          name={RouteNames.storeStack}
          component={StoreStackNavigation}
        />
        <RootStack.Screen
          name={RouteNames.profileStack}
          component={ProfileStackNavigation}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
