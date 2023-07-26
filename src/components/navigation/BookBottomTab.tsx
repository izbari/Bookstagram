import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationParamsList} from './NavigationParamsList';
import {RouteNames} from './RouteNames';
import {DiscoverBookStackNavigation} from './stacks/DiscoverBookStackNavigation.tsx';
import {StoreStackNavigation} from './stacks/StoreStackNavigation';
import {MyStoreStackNavigation} from './stacks/MyStoreStackNavigation';
import {BookSearchStackNavigation} from './stacks/BookSearchStack';
import {Colors} from '../../resources/constants/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
const BookStack = createBottomTabNavigator<NavigationParamsList>();
export const BookBottomTab: React.FunctionComponent = () => {
  return (
    <BookStack.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      initialRouteName={RouteNames.discoverBook}>
      <BookStack.Screen
        name={RouteNames.discoverBook}
        component={DiscoverBookStackNavigation}
        options={{
          headerShown: false,
        }}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons
              name={'bookshelf'}
              size={25}
              color={focused ? Colors.lightPurple : 'gray'}
            />
          ),
        }}
      />
      <BookStack.Screen
        name={RouteNames.searchBookStack}
        component={BookSearchStackNavigation}
        options={{
          headerShown: false,
        }}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons
              name={focused ? 'book-search' : 'book-search-outline'}
              size={25}
              color={focused ? Colors.lightPurple : 'gray'}
            />
          ),
        }}
      />
      <BookStack.Screen
        name={RouteNames.storeStack}
        component={StoreStackNavigation}
        options={{
          headerShown: false,
        }}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons
              name={focused ? 'store-search' : 'store-search-outline'}
              size={25}
              color={focused ? Colors.lightPurple : 'gray'}
            />
          ),
        }}
      />
      <BookStack.Screen
        name={RouteNames.myStoreStack}
        component={MyStoreStackNavigation}
        options={{
          headerShown: false,
        }}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Fontisto
              name={'shopping-store'}
              size={20}
              color={focused ? Colors.lightPurple : 'gray'}
            />
          ),
        }}
      />
    </BookStack.Navigator>
  );
};
