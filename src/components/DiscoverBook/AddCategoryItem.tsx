import {ImageBackground, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
type IAddCategoryItem = {
  item: any;
  index: number;
  isUserCategory?: boolean;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
};
export const AddCategoryItem: React.FunctionComponent<IAddCategoryItem> = ({
  item,
  index,
  isUserCategory,
  selectedCategories,
  setSelectedCategories,
}) => {
  const isSelected = selectedCategories.includes(item?.category);
  return (
    <TouchableOpacity
      style={tw`flex-1 items-center p-4`}
      onPress={() => {
        setSelectedCategories(curr => {
          if (isSelected) {
            return curr.filter(category => category !== item?.category);
          }
          return [...curr, item?.category];
        });
      }}>
      <ImageBackground
        imageStyle={tw`rounded-full`}
        style={[
          tw`h-20 w-20 rounded-full items-center justify-center `,
          {
            opacity: isSelected || isUserCategory ? 0.45 : 1,
          },
        ]}
        resizeMode="cover"
        source={{
          uri: item?.url,
        }}>
        {(isSelected || isUserCategory) && (
          <Ionicons
            name="checkmark-outline"
            size={35}
            style={tw`absolute`}
            color={'white'}
          />
        )}
      </ImageBackground>

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={tw`text-base text-center`}>
        {item.category}
      </Text>
    </TouchableOpacity>
  );
};
