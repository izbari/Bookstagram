import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import {RouteNames} from '../../components/navigation/RouteNames';
import {IWithNavigation} from '../../components/navigation/Types';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';
import {Colors} from '../../resources/constants/Colors';
import CommonHeader from '../../components/Common/CommonHeader';
type ISelectCategoryProps = IWithNavigation<RouteNames.selectCategory>;

export const categoryList = {
  Fantasy: false,
  Adventure: false,
  Diary: false,
  Crime: false,
  Mystery: false,
  Horror: false,
  Thriller: false,
  Paranormal: false,
  'Historical fiction': false,
  'Science Fiction': false,
  Memoir: false,
  Cooking: false,
  Art: false,
  Poetry: false,
  Development: false,
  Motivational: false,
  Health: false,
  History: false,
  Travel: false,
  Drama: false,
  'Families & Relationships': false,
  Humor: false,
  Children: false,
  Business: false,
  Other: false,
} as const;

export const SelectCategory: React.FunctionComponent<
  ISelectCategoryProps
> = props => {
  const {t} = useTranslation();
  const [selectedCategories, setSelectedCategories] =
    React.useState(categoryList);

  const onPressHandle = (category: keyof typeof categoryList) => {
    setSelectedCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  return (
    <View style={tw`flex-1`}>
      <CommonHeader
        title={t('product-info.category')}
        right={
          <TouchableOpacity
            style={tw`absolute right-4`}
            onPress={() =>
              props.navigation.navigate(RouteNames.sellNow, {
                categories: Object.keys(selectedCategories).filter(
                  item => selectedCategories[item as keyof typeof categoryList],
                ),
              })
            }>
            <Text style={tw`text-white text-lg text-center font-bold`}>
              Done
            </Text>
          </TouchableOpacity>
        }
      />
      <FlashList
        data={Object.keys(categoryList)}
        estimatedItemSize={24}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => onPressHandle(item)}
            style={tw`h-15 mb-0.5 bg-white justify-center`}>
            <Text style={tw`ml-5 font-semibold text-sm`}>{item}</Text>
            {selectedCategories[item as keyof typeof categoryList] && (
              <Icon
                name="checkmark"
                size={25}
                color={Colors.darkPurple}
                style={tw`absolute right-5`}
              />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
