import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationParamsList} from './NavigationParamsList';
import {RouteNames} from './RouteNames';

import {useTranslation} from 'react-i18next';
import {useAuth} from '../../infrastructure/Utils/useAuth';
import {ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {INavigationType} from './Types';
import { LandingStackNavigation as LandingStack } from './stacks/LandingStackNavigation';
import { ProfileStackNavigation as ProfileStack } from './stacks/ProfileStackNavigation';
const MainStack = createBottomTabNavigator<NavigationParamsList>();
// const Icon: React.FunctionComponent<{
//   routeName: string;
//   focused: boolean;
// }> = ({routeName, focused}) => {
//   let icon = null;
//   switch (routeName) {
//     case RouteNames.landing:
//       icon = focused ? HomeFilled : HomeOutline;
//       break;
//     case RouteNames.favorites:
//       icon = focused ? FavoriteFilled : FavoriteOutline;
//       break;
//     case RouteNames.profile:
//       icon = focused ? ProfileFilled : ProfileOutline;
//       break;
//     default:
//       break;
//   }

//   return <SvgFromXml xml={icon} />;
// };
export const MainStackNavigation: React.FunctionComponent = () => {
  return (
    <MainStack.Navigator
      // screenOptions={{
      //   headerShown: false,
      //   tabBarActiveTintColor: Colors.secondaryColor,
      //   tabBarInactiveTintColor: Colors.primaryColor,
      //   tabBarShowLabel: false,
      //   tabBarStyle: {
      //     backgroundColor: Colors.primaryColor,
      //   },
      // }}

      initialRouteName={RouteNames.profile}>
      <MainStack.Screen
        name={RouteNames.landing}
        component={LandingStack}
        options={{
          headerShown: false,
        }}  
        // options={{
        //   tabBarIcon: ({focused}) =>
        //     Icon({routeName: RouteNames.landing, focused}),
        // }}
      />
      <MainStack.Screen
        name={RouteNames.profile}
        component={ProfileStack}
        options={{
          headerShown: false,
        }StackNavigation}
        // options={{
        //   tabBarIcon: ({focused}) =>
        //     Icon({routeName: RouteNames.landing, focused}),
        // }}
      />
      <MainStack.Screen
        name={RouteNames.createPostTab}
        component={Blank}
        listeners={({navigation}) => ({
          focus: () => {
            navigation.navigate(RouteNames.createPost);
          },
        })}
      />
      <MainStack.Screen
        name={RouteNames.chat}
        options={{headerShown: false}}
        component={ChatStackNavigation}
        // options={{
        //   tabBarIcon: ({focused}) =>
        //     Icon({routeName: RouteNames.landing, focused}),
        // }}
      />
    </MainStack.Navigator>
  );
};
