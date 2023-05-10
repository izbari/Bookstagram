import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {NavigationParamsList} from './NavigationParamsList';
import {RouteNames} from './RouteNames';

export interface IWithNavigation<route extends string> {
  readonly navigation: NativeStackNavigationProp<NavigationParamsList, route>;
  readonly route: RouteProp<NavigationParamsList, route>;
}
export type INavigationType = NativeStackNavigationProp<
  NavigationParamsList,
  RouteNames
>;
