import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationParamsList} from './NavigationParamsList';
import {RouteNames} from './RouteNames';

import {Alert} from 'react-native';
const MainStack = createBottomTabNavigator<NavigationParamsList>();
const Icon: React.FunctionComponent<{
  routeName: string;
  focused: boolean;
}> = ({routeName, focused}) => {
  let icon = null;
  switch (routeName) {
    case RouteNames.landing:
      icon = focused ? HomeFilled : HomeOutline;
      break;
    case RouteNames.favorites:
      icon = focused ? FavoriteFilled : FavoriteOutline;
      break;
    case RouteNames.profile:
      icon = focused ? ProfileFilled : ProfileOutline;
      break;
    default:
      break;
  }

  return <SvgFromXml xml={icon} />;
};

export const MainStackNavigation: React.FunctionComponent = () => {
  const {t} = useTranslation(['translation']);
  React.useEffect(() => {
    const login = async (): Promise<void> => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        await AuthService.Login(
          store.dispatch,
          credentials.username,
          credentials.password,
        ).catch((_err: unknown) => {
          Alert.alert(t('profile.error-alert-text'));
        });
      }
    };
    login();
  }, [t]);

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.secondaryColor,
        tabBarInactiveTintColor: Colors.primaryColor,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.primaryColor,
        },
      }}
      initialRouteName={RouteNames.landingMain}>
      <MainStack.Screen
        name={RouteNames.landingMain}
        component={LandingStackNavigation}
        options={{
          tabBarIcon: ({focused}) =>
            Icon({routeName: RouteNames.landing, focused}),
        }}
      />

      <MainStack.Screen
        name={RouteNames.favorite}
        component={FavoriteStackNavigation}
        options={{
          tabBarIcon: ({focused}) =>
            Icon({routeName: RouteNames.favorites, focused}),
        }}
      />
      <MainStack.Screen
        name={RouteNames.profile}
        component={ProfileStackNavigation}
        options={{
          tabBarIcon: ({focused}) =>
            Icon({routeName: RouteNames.profile, focused}),
        }}
      />
    </MainStack.Navigator>
  );
};
