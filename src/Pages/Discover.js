import React from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  View,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import {LinearGradient} from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, {Line, Rect} from 'react-native-svg';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import {ToastAndroid} from 'react-native';
import useFetch from '../hooks/useFetch';
import axios from 'axios';
import {useSelector} from 'react-redux';
import bookController from '../controllers/bookController';
const {width, height} = Dimensions.get('window');

import {getMovies} from './api';

const ITEM_SIZE = width * 0.2;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;

function Discover(props) {
  // States hooks
  const {loading, error, data, categories} = useFetch(false);
  const [name, setName] = React.useState('');
  const [movies, setMovies] = React.useState([]);
  const [trending, setTrending] = React.useState([]);

  const scrollX = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const fetchData = async () => {
      const movies = await getMovies();
      const trend = await getMovies();
      // Add empty items to create fake space
      // [empty_item, ...movies, empty_item]
      setTrending(trend);
      setMovies([{key: 'empty-left'}, ...movies, {key: 'empty-right'}]);
    };

    if (movies.length === 0) {
      fetchData(movies);
    }
  }, [movies]);
  React.useEffect(() => {}, [scrollX]);
  const CustomFlatlist = () => {
    return (
      <View style={styles.container}>
        <Animated.FlatList
          showsHorizontalScrollIndicator={false}
          data={movies}
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
                  <Image
                    source={{
                      uri: item.imageURL,
                    }}
                    style={styles.posterImage}
                  />
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

  const list = useSelector(store => store.topicIds);

  const selectedTopics = ({item}) => {
    {
      if (item == -1) {
        return (
          <View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('AddTopics')}
              style={{
                overFlow: 'hidden',
                marginLeft: 5,
                marginRight: 15,
                backgroundColor: '#44494B',
                width: 67,
                height: 67,
                borderRadius: 50,
                justifyContent: 'center',
              }}>
              <MaterialCommunityIcons
                name="plus"
                color="white"
                size={35}
                style={{alignSelf: 'center'}}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 11,
                marginRight: 10,
                margin: 1,
              }}
              numberOfLines={1}>
              Add
            </Text>
          </View>
        );
      } else {
        if (list.includes(item)) {
          return (
            <View style={{height: 110, width: 100, marginBottom: 20}}>
              <Image
                style={{
                  height: 70,
                  width: 70,
                  resizeMode: 'contain',
                  borderRadius: 50,
                  overflow: 'hidden',
                }}
                source={{
                  uri: data[item].url,
                }}
                size="large"
                indicator={ProgressBar.indeterminate}
                indicatorProps={{
                  size: 20,
                  borderWidth: 0,
                  color: 'rgba(150, 150, 150, 1)',
                  unfilledColor: 'rgba(200, 200, 200, 0.2)',
                }}></Image>

              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: 11,
                  marginRight: 28,
                }}
                numberOfLines={1}>
                {categories[item]}
              </Text>
            </View>
          );
        }
      }
    }
  };
  const TrendItem = ({item, index}) => (
    <TouchableOpacity
      onPress={() =>
        props.navigation.navigate('SingleBookDesc', {singleBookData: item})
      }
      style={{height: 180, width: 100, margin: 10, marginBottom: 15}}>
      <Image
        source={{uri: item.imageURL}}
        style={{
          height: 150,
          width: 100,
          borderRadius: 8,
          overflow: 'hidden',
        }}></Image>
      <Text
        numberOfLines={2}
        style={{color: 'black', fontSize: 14, alignSelft: 'center'}}>
        {item.title}
      </Text>
      <Text
        numberOfLines={1}
        style={{alignSelft: 'center', color: '#A1A1A1', fontSize: 8}}>
        by {item.author}
      </Text>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={{flex: 1}} horizontal={true}>
      <View style={styles.pickedBooks}>
        <Text
          style={{
            fontSize: 28,
            color: 'white',
            padding: 20,
            fontWeight: 'bold',
          }}>
          Our Top Picks
        </Text>
        <CustomFlatlist />
      </View>

      <ScrollView nestedScrollEnabled={true} style={{flex: 0.5}}>
        <View
          style={{
            flex: 0.1,
            flexDirection: 'row',
            width: width,
            height: 100,
            justifyContent: 'center',
            margin: 15,
          }}>
          <FlatList
            data={list}
            renderItem={selectedTopics}
            keyExtractor={(item, index) => item.id}
            horizontal={true}
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{alignContent: 'center'}}
          />
        </View>
        <View
          style={{
            flex: 0.4,

            width: width,

            justifyContent: 'center',
            margin: 15,
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 24,
              fontWeight: 'bold',
              padding: 5,
              marginBottom: 20,
            }}>
            Trending Books
          </Text>
          <View style={{width: width, flex: 1}}>
            <FlatList
              data={trending}
              renderItem={TrendItem}
              keyExtractor={item => item.key}
              nestedScrollEnabled
              numColumns={3}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },

  posterImage: {
    overflow: 'hidden',
    width: 70,
    height: 95,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
  },
  pickedBooks: {width: width, flex: 0.5, backgroundColor: '#EE8BAD'},
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
export default Discover;
