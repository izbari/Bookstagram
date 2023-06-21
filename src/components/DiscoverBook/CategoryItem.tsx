import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import Image from 'react-native-fast-image';
type ICategoryItem = {
  category: string;
  url: string;
};
const CategoryItem: React.FunctionComponent<ICategoryItem> = ({
  category,
  url,
}) => {
  return (
    <TouchableOpacity style={tw`flex-1 items-center justify-center mx-2`}>
      <Image
        style={tw`h-15 w-15 rounded-full items-center justify-center`}
        resizeMode="cover"
        source={{
          uri: url,
        }}
      />

      {/* <Text style={tw`text-xs text-center font-semibold`} numberOfLines={1}>
        {category}
      </Text> */}
    </TouchableOpacity>
  );
};

export default CategoryItem;
