import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Alert,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import {useGetAllProductsQuery} from '../../infrastructure/Service/ProductService';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import {Colors} from '../../resources/constants/Colors';
import {categoryList} from './SelectCategory';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
type IStoreProps = IWithNavigation<RouteNames.store>;
const {width} = Dimensions.get('window');
const ITEM_WIDTH = width * 0.5 - 15;
export const Store: React.FunctionComponent<IStoreProps> = props => {
  const [searchFocus, setSearchFocus] = useState(false);
  const user = useAppSelector(store => store.user.user);
  const {data: products, isLoading} = useGetAllProductsQuery(user?.id, {
    skip: !user?.id,
  });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [limit, setLimit] = useState(10);
  const [searchedProducts, setSearchedProducts] = useState(products ?? []);
  const [text, setText] = useState('');
  React.useEffect(() => {
    setSearchedProducts(products);
  }, [products?.length]);

  const handleSearch = text => {
    if (!products?.length) {
      return;
    }
    if (text === '') {
      setSearchedProducts(products);
      return setText(text);
    }
    setText(text);
    setSearchedProducts(
      products?.filter(
        product =>
          (product?.productHeader as string)
            ?.toLowerCase?.()
            ?.indexOf?.(text?.toLowerCase?.()) !== -1,
      ),
    );
  };
  const prepareData = () => {
    const _products = searchedProducts;
    if (!_products?.length) {
      return [];
    } else if (selectedCategories.length === 0) {
      return _products.length > limit ? _products.slice(0, limit) : _products;
    }
    return _products
      .filter(product =>
        selectedCategories.some(category =>
          product?.categories?.includes(category),
        ),
      )
      ?.slice(0, limit);
  };
  const data = prepareData();
  const handleLike = async (id: string) => {
    try {
      const favoriteProduct = user?.favoriteProducts ?? [];
      const handledFavoriteProducts = favoriteProduct?.includes?.(id)
        ? favoriteProduct?.filter?.(productId => productId !== id)
        : [...favoriteProduct, id];
      await database()
        .ref(`users/${user?.id}`)
        .update({favoriteProducts: handledFavoriteProducts});
    } catch (error) {
      Alert.alert('Something went wrong...' + error);
    }
  };
  return (
    <View style={tw`flex-1 bg-transparent`}>
      <View style={tw`flex-row items-center h-16`}>
        <View
          style={[
            tw`flex-row m-2 bg-gray-200 rounded-lg items-center px-2 justify-evenly p-4`,
            searchFocus && {width: '80%'},
          ]}>
          <Icon name="search-outline" size={20} color="gray" />
          <TextInput
            style={tw`bg-gray-200 flex-1 ml-2`}
            placeholder="Search"
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            onChangeText={handleSearch}
            value={text}
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
      <View>
        <FlatList
          data={Object.keys(categoryList)}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                if (selectedCategories.includes(item)) {
                  setSelectedCategories(
                    selectedCategories.filter(category => category !== item),
                  );
                  return;
                }
                setSelectedCategories([...selectedCategories, item]);
              }}
              style={[
                tw`border rounded-2xl p-1 px-2 border-gray-700 mx-1 my-2 text-gray-700`,
                selectedCategories.includes(item) &&
                  tw`bg-[${Colors.lightPurple}] border-0`,
              ]}>
              <Text
                style={{
                  fontWeight: '600',
                  padding: 3,
                  color: selectedCategories.includes(item) ? 'white' : 'black',
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View
        style={{
          alignItems: 'center',
        }}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.lightPurple} />
        ) : (
          <FlatList
            data={data}
            contentContainerStyle={{paddingBottom: 150}}
            onEndReached={() =>
              setLimit(limit <= data.length ? limit + 10 : limit)
            }
            ListFooterComponent={() =>
              limit <= data.length && (
                <ActivityIndicator size="large" color={Colors.lightPurple} />
              )
            }
            renderItem={({item}) => (
              <Pressable
                onPress={() =>
                  props.navigation.navigate(RouteNames.productInfo, {
                    productId: item?.id,
                  })
                }
                style={{
                  width: ITEM_WIDTH,
                  paddingVertical: 5,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: 'lightgray',
                  margin: 5,
                  backgroundColor: 'white',
                }}>
                <FastImage
                  source={{uri: item?.productImages[0]}}
                  style={{
                    width: '93%',
                    height: 200,
                    borderRadius: 5,
                    alignSelf: 'center',
                  }}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => handleLike(item?.id)}
                  style={tw`absolute top-2 right-2`}>
                  <Ionicons
                    name={
                      user?.favoriteProducts?.includes?.(item?.id)
                        ? 'heart'
                        : 'heart-outline'
                    }
                    size={20}
                    color="white"
                    style={{position: 'absolute', right: 10, top: 10}}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    padding: 5,
                    marginTop: 10,
                    gap: 10,
                  }}>
                  <Text numberOfLines={2} ellipsizeMode="tail" style={tw``}>
                    {item?.productHeader}
                  </Text>
                  <Text style={tw`font-bold text-base`}>
                    {item?.price + ' TL'}
                  </Text>
                </View>
                {/* <Text>{item?.title}</Text>
                <Text>{item?.price}</Text> */}
              </Pressable>
            )}
            numColumns={2}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    </View>
  );
};
