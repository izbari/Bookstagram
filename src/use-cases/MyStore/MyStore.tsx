import {
  Text,
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../resources/constants/Colors';
import tw from 'twrnc';
import {useTranslation} from 'react-i18next';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {SecondHandSaleCard} from '../../components/MyStore/SecondHandSaleCard';
import {RouteNames} from '../../components/navigation/RouteNames';
import {IWithNavigation} from '../../components/navigation/Types';
import {useGetProductsByUserIdQuery} from '../../infrastructure/Service/ProductService';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
type IMyStoreProps = IWithNavigation<RouteNames.myStore>;

const books = [
  {
    title: 'Java',
    price: '10 TL',
    image:
      'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
  },
  {
    title: 'Jotform',
    price: '20 TL',
    image:
      'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
  },
  {
    title: 'Harry Potter',
    price: '30 TL',
    image:
      'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
  },
  {
    title: 'Fahrenheit 451',
    price: '40 TL',
    image:
      'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
  },
];

export const MyStore: React.FunctionComponent<IMyStoreProps> = props => {
  const {t} = useTranslation();
  const user = useAppSelector(store => store.user.user);
  const {data : userProducts, isLoading} = useGetProductsByUserIdQuery(user?.id, {
    skip: !user?.id,
  });
  console.warn('userProducts', userProducts);
  const [favorite, setFavorite] = React.useState(false);
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: t('my-store.store')},
    {key: 'second', title: t('my-store.favorites')},
    {key: 'third', title: t('my-store.sold')},
  ]);

  const StoreTabScreen = () => (
    <FlashList
      numColumns={2}
      data={userProducts}
      renderItem={({item}) => (
        <SecondHandSaleCard
          title={item?.productHeader}
          price={item?.price}
          image={item?.productImages[0]}
          onPress={() => props.navigation.navigate(RouteNames.productInfo, {productId: item?.id})}
          isMine={true}
        />
      )}
      estimatedItemSize={20}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={tw`pb-2 pt-2`}
    />
  );

  const FavoritesTabScreen = () => (
    <FlashList
      numColumns={2}
      data={books}
      renderItem={({item}) => (
        <SecondHandSaleCard
          onFavoritePress={() => setFavorite(!favorite)}
          isFavorite={favorite}
          title={item.title}
          price={item.price}
          image={item.image}
          isMine={false}
        />
      )}
      estimatedItemSize={20}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={tw`pb-2 pt-2`}
    />
  );

  const SoldTabScreen = () => (
    <FlashList
      numColumns={2}
      data={books}
      renderItem={({item}) => (
        <SecondHandSaleCard
          title={item.title}
          price={item.price}
          image={item.image}
          isMine={true}
          isSold={true}
        />
      )}
      estimatedItemSize={20}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={tw`pb-2 pt-2`}
    />
  );

  const renderScene = SceneMap({
    first: StoreTabScreen,
    second: FavoritesTabScreen,
    third: SoldTabScreen,
  });

  return (
    <View style={tw`flex-1 bg-white`}>
      <TouchableOpacity
        style={tw`absolute left-2 top-2 z-1`}
        onPress={() => props.navigation.navigate(RouteNames.profile)}>
        <Icon name="chevron-back-outline" size={30} color="white" />
      </TouchableOpacity>
      <View style={tw` bg-[${Colors.lightPurple}] h-30 p-8`} />
      <View style={tw`p-4 mt-[-70]`}>
        <Image
          source={{uri: 'https://picsum.photos/200'}}
          style={tw` w-25 h-25 rounded-full border-2 border-white`}
          resizeMode="cover"
        />
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-lg w-30 font-semibold`}>meliketekin</Text>
          <TouchableOpacity
            style={tw` bg-white border-[${Colors.darkPurple}] border-2 px-2 h-10 justify-evenly items-center rounded-md shadow-md flex-row`}
            onPress={() => props.navigation.navigate(RouteNames.sellNow)}>
            <Icon name="add" size={25} color={Colors.darkPurple} />
            <Text style={tw`text-[${Colors.darkPurple}]`}>
              {t('my-store.sell')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        style={tw`bg-white flex-1`}
        renderTabBar={props => (
          <TabBar
            {...props}
            style={tw`bg-white`}
            indicatorStyle={tw`bg-[${Colors.darkPurple}]`}
            labelStyle={tw`text-[${Colors.darkPurple}] font-semibold text-sm normal-case`}
            android_ripple={tw`text-transparent`}
          />
        )}
      />
    </View>
  );
};
