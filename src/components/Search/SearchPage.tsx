import {Text, TextInput, View} from 'react-native';
import React from 'react';
import {IWithNavigation} from '../navigation/Types';
import {RouteNames} from '../navigation/RouteNames';
import tw from 'twrnc';
type ISearchProps = {
  readonly navigation: IWithNavigation<RouteNames.searchMain>;
};
export const SearchPage: React.FunctionComponent<ISearchProps> = () => {
  return (
    <View style={tw`p-2`}>
      <TextInput
        placeholder="Search"
        // onChangeText={text => setSearch(text)}
        // value={search}
        // onSubmitEditing={() => {
        //   if (search.length > 0) {
        //     props.navigation.navigate(RouteNames.searchResult, {
        //       search: search,
        //     });
        //   }
        // }}
        style={tw`
            border-2 border-gray-300 rounded-sm px-4 py-2 w-full
        `}
      />
    </View>
  );
};
