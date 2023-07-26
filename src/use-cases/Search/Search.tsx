import {View} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import {SearchPage} from '../../components/Search/SearchPage';
type ISearchProps = IWithNavigation<RouteNames.search>;
export const Search: React.FunctionComponent<ISearchProps> = props => {
  return (
    <View style={tw`flex-1`}>
      <SearchPage navigation={props.navigation} />
    </View>
  );
};
