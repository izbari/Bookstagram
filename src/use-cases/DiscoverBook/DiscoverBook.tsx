import React from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  View,
  Dimensions,
  ScrollView,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Image from 'react-native-fast-image';
import tw from 'twrnc';
const {width} = Dimensions.get('window');

// import {useBook} from '../../infrastructure/Utils/useBook';
import {getBooks} from '../../infrastructure/Controllers/BookController';
import Categories from '../../components/DiscoverBook/Categories';
import {TrendBookItems} from '../../components/DiscoverBook/TrendBookItems';
import {Colors} from '../../resources/constants/Colors';
import {RouteNames} from '../../components/navigation/RouteNames';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import {IWithNavigation} from '../../components/navigation/Types';

const ITEM_SIZE = width * 0.2;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2 - 12;

type IDiscoverBook = IWithNavigation<RouteNames.discoverBook>;
export const DiscoverBook: React.FunctionComponent<IDiscoverBook> = props => {
  const user = useAppSelector(state => state.user.user);
  const [books, setBooks] = React.useState([]);
  const [trending, setTrending] = React.useState([]);

  const scrollX = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const fetchData = async () => {
      const books = await getBooks();
      const trend = await getBooks();
      // Add empty items to create fake space
      // [empty_item, ...movies, empty_item]
      setTrending(trend);
      setBooks([{key: 'empty-left'}, ...books, {key: 'empty-right'}]);
    };

    if (books.length === 0) {
      fetchData(books);
    }
  }, [books]);

  const CustomFlatlist = () => {
    return (
      <View style={styles.container}>
        <Animated.FlatList
          showsHorizontalScrollIndicator={false}
          data={books}
          keyExtractor={item => item.key}
          horizontal
          bounces={false}
          decelerationRate={0}
          snapToInterval={ITEM_SIZE}
          snapToAlignment="start"
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true},
          )}
          scrollEventThrottle={16}
          renderItem={({item, index}) => {
            if (!item.title) {
              return <View style={{width: EMPTY_ITEM_SIZE + 30}} />;
            }
            const inputRange = [
              (index - 2) * ITEM_SIZE,
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
            ];

            const translateY = scrollX.interpolate({
              inputRange,
              outputRange: [5, 20, 5],
            });

            return (
              <View style={{width: ITEM_SIZE, height: ITEM_SIZE}}>
                <Animated.View
                  style={{
                    marginHorizontal: 10,
                    padding: 10,
                    alignItems: 'center',
                    width: 10,
                    height: 300,
                    transform: [{translateY}],
                    borderRadius: 20,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate(RouteNames.bookDetail, {
                        item: item,
                      })
                    }>
                    <Image
                      source={{
                        uri: item?.imageURL.replace('http', 'https'),
                      }}
                      style={styles.posterImage}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: 'white',
                      position: 'absolute',
                      top: 110,
                    }}
                    numberOfLines={1}>
                    {item.title.slice(0, 10)}...
                  </Text>
                </Animated.View>
              </View>
            );
          }}
        />
      </View>
    );
  };
  // console.warn(categories);
  // if (loading) {
  //   return (
  //     <View style={tw`flex-1 justify-center`}>
  //       <ActivityIndicator size={'large'} color="#FF6EA1" />
  //     </View>
  //   );
  // }
  return (
    <SafeAreaView style={tw`flex-1 `}>
      <View style={styles.pickedBooks}>
        <View style={tw`flex-row justify-between items-center my-3`}>
          <TouchableOpacity
            onPress={props.navigation?.openDrawer}
            style={tw`z-9`}>
            <Image
              source={{uri: user?.imageUrl}}
              style={tw`w-8 h-8 rounded-full ml-4`}
            />
          </TouchableOpacity>
          <Text
            style={tw`text-2xl text-white text-center font-semibold p-4 my-2 absolute w-full`}>
            Our Top Picks
          </Text>
        </View>
        <CustomFlatlist />
      </View>

      <ScrollView nestedScrollEnabled style={{flex: 0.5}}>
        {/* Categories */}
        <Categories />
        {/* Trending Books Section */}
        <TrendBookItems trending={trending as any[]} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.lightPurple,
  },

  posterImage: {
    overflow: 'hidden',
    width: 70,
    height: 95,
    resizeMode: 'cover',
    borderRadius: 18,
    margin: 0,
  },
  pickedBooks: {width: width, flex: 0.55, backgroundColor: Colors.lightPurple},
  mainContainer: {flex: 1, backgroundColor: 'white'},
  lottieContainer: {
    flex: 2,
    width: '85%',
    height: '30%',
    alignSelf: 'center',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonContainer: {flex: 1, margin: 10},
  button: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    width: 290,
    height: 38,
    backgroundColor: '#FF6EA1',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    paddingLeft: 12,
    borderRadius: 10,

    width: 290,
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 10,
    backgroundColor: 'white',
  },
});
