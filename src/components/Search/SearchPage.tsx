import {Text, View} from 'react-native';
import React from 'react';
import {IWithNavigation} from '../navigation/Types';
import {RouteNames} from '../navigation/RouteNames';
type ISearchProps = {
  readonly navigation: IWithNavigation<RouteNames.searchMain>;
};
export const SearchPage: React.FunctionComponent<ISearchProps> = () => {
  return (
    <View>
      <Text>SearchPage</Text>
    </View>
  );
};
