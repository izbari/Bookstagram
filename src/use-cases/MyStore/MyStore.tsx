import {Text, View, Image, useWindowDimensions, FlatList} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import React from 'react';
import {Colors} from '../../resources/constants/Colors';
import tw from 'twrnc';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {SecondHandSaleCard} from '../../components/MyStore/SecondHandSaleCard';
import {RouteNames} from '../../components/navigation/RouteNames';
import {IWithNavigation} from '../../components/navigation/Types';
type IMyStoreProps = IWithNavigation<RouteNames.store>;

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
const StoreTabScreen = () => (
  <FlatList
    numColumns={2}
    data={books}
    renderItem={({item}) => (
      <SecondHandSaleCard
        title={item.title}
        price={item.price}
        image={{uri: item.image}}
        isMine={true}
      />
    )}
    estimatedItemSize={20}
    showsVerticalScrollIndicator={true}
    contentContainerStyle={{paddingBottom: 10, paddingTop: 10}}
  />
);

const FavoritesTabScreen = () => (
  <FlatList
    numColumns={2}
    data={books}
    renderItem={({item}) => (
      <SecondHandSaleCard
        title={item.title}
        price={item.price}
        image={{uri: item.image}}
        isMine={false}
      />
    )}
    estimatedItemSize={20}
    showsVerticalScrollIndicator={true}
    contentContainerStyle={{paddingBottom: 10, paddingTop: 10}}
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
        image={{uri: item.image}}
        isMine={true}
        isSold={true}
      />
    )}
    estimatedItemSize={20}
    showsVerticalScrollIndicator={true}
    centerContent={true}
    contentContainerStyle={{paddingBottom: 10, paddingTop: 10 }}
  />
);

const renderScene = SceneMap({
  first: StoreTabScreen,
  second: FavoritesTabScreen,
  third: SoldTabScreen,
});

export const MyStore: React.FunctionComponent<IMyStoreProps> = props => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'Store'},
    {key: 'second', title: 'Favorites'},
    {key: 'third', title: 'Sold'},
  ]);

  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`pb-24 bg-white `}>
        <View style={tw`w-full bg-[${Colors.lightPurple}] h-30`}>
          <Image
            source={{uri: 'https://picsum.photos/200'}}
            style={tw`absolute w-25 h-25 rounded-full top-15 left-5 border-2 border-white`}
            resizeMode="cover"
          />
        </View>
        <Text style={tw`absolute left-5 top-40 text-lg w-30 font-semibold`}>
          meliketekin
        </Text>
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
