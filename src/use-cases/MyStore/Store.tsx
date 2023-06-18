import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import {
  useGetAllProductsQuery,
  useGetProductsByCategoryQuery,
} from '../../infrastructure/Service/ProductService';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import {SecondHandSaleCard} from '../../components/MyStore/SecondHandSaleCard';
import auth from '@react-native-firebase/auth';
import {Colors} from '../../resources/constants/Colors';
import {categoryList} from './SelectCategory';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type IStoreProps = IWithNavigation<RouteNames.store>;

export const Store: React.FunctionComponent<IStoreProps> = props => {
  const [searchFocus, setSearchFocus] = useState(false);
  const user = useAppSelector(store => store.user.user);
  const {data: products, isLoading} = useGetAllProductsQuery(user?.id, {
    skip: !user?.id,
  });
  // const [productList, setProductList] = useState([]);

  // useEffect(() => {
  //   setProductList(products);
  // }, [productList]);
  
  

  return (
    <View style={tw`flex-1 bg-transparent`}>
      <View style={tw`flex-row items-center justify-evenly h-16`}>
        <View
          style={[
            tw`flex-row m-2 bg-gray-200 rounded-lg items-center px-2 justify-evenly`,
            searchFocus && {width: '80%'},
            searchFocus && {marginRight: 1},
          ]}>
          <Icon name="search-outline" size={20} color="gray" />
          <TextInput
            style={tw`bg-gray-200 flex-1 ml-2`}
            placeholder="Search"
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
          />
        </View>
        {searchFocus && (
          <TouchableOpacity onPress={Keyboard.dismiss} style={tw`p-1`}>
            <Text style={tw`text-[${Colors.darkPurple}] font-semibold`}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={Object.keys(categoryList)}
        horizontal
        style={tw`z-99`}
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{
          alignItems: 'center',
          height: 60,
          marginBottom: 10,
          marginLeft: 10,
        }}
        renderItem={({item}) => (
          <TouchableOpacity
            style={tw`border rounded-2xl p-1 px-2 border-gray-700 mr-1 mb-1.5 text-gray-700 `}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* <View style={tw`flex-row flex-wrap w-full`}>
          {Object.keys(categoryList).map((category, index) => {
            return (
              <Text
                key={index}
                style={tw`border rounded-2xl p-1 px-2 border-gray-700 mr-1 mb-1.5 text-gray-700 `}>
                {category}
              </Text>
            );
          })}
        </View> */}
      <FlatList
        data={products}
        renderItem={({item}) => (
          <SecondHandSaleCard
            title={item?.productHeader}
            price={item?.price}
            image={item?.productImages[0]}
            onPress={() =>
              props.navigation.navigate(RouteNames.productInfo, {
                productId: item?.id,
              })
            }
            isMine={false}
          />
        )}
        numColumns={2}
        keyExtractor={item => item.id}
      />
    </View>
  );
};
