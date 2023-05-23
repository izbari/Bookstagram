import {View, Text} from 'react-native';
import React from 'react';
import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
type IRegisterProps = IWithNavigation<RouteNames.register>;
export const Register: React.FunctionComponent<IRegisterProps> = props => {
  return (
    <View>
      <Text>Register</Text>
    </View>
  );
};
