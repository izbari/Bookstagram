import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationParamsList} from './NavigationParamsList';
import {RouteNames} from './RouteNames';

import {LandingStackNavigation} from './stacks/LandingStackNavigation';
import {ChatStackNavigation} from './stacks/ChatStackNavigation';

ChatStackNavigation;
const Blank = () => <></>;

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

      initialRouteName={RouteNames.landing}>
      <MainStack.Screen
        name={RouteNames.landing}
        component={LandingStackNavigation}
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
