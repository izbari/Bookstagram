import {FlatList, Text, View} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import CategoryItem from './CategoryItem';
const Categories = () => {
  return (
    <View>
      <FlatList
        data={[1, 2, 3]}
        renderItem={() => <CategoryItem />}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Categories;
