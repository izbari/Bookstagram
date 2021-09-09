import React from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Svg, {Line, Rect} from 'react-native-svg';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import {ToastAndroid} from 'react-native';
import useFetch from '../hooks/useFetch';
import axios from 'axios';
import {useSelector} from 'react-redux';
import bookController from '../controllers/bookController';

function Discover(props) {
  // States hooks
  const {loading, error, data, categories} = useFetch(false);
  const [topPicks, setTopPicks] = React.useState([]);
  React.useEffect(() => {
    getData();
  }, []);

  const {width, height} = Dimensions.get('window');
  const ITEM_SIZE = width * 0.72;
  const SPACING = 10;
  const scrollX = React.useRef(Animated.Value(0)).current;
  const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;
  const BACKDROP_HEIGHT = width * 0.6;
  // try {
  //   if (typeof (props.route.params.categories) !== 'undefined' &&
  //     props.route.params.categories != null) {
  //     setData(props.route.params.data)
  //     setCategories(props.route.params.categories)

  //   }

  // } catch (err) {
  //   console.log(err)
  // }

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);

  const list = useSelector(store => store.topicIds);

  const selectedTopics = ({item}) => {
    {
      if (item == -1) {
        return (
          <TouchableOpacity
            onPress={() => props.navigation.navigate('AddTopics')}
            style={{
              overFlow: 'hidden',
              marginLeft: 10,
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
                  alignSelf: 'center',
                  marginRight: 30,
                  fontSize: 11,
                }}>
                {categories[item]}
              </Text>
            </View>
          );
        }
      }
    }
  };

  const Backdrop = ({topPicks, scrollX}) => {
    return (
      <View style={{position: 'absolute', width, height: BACKDROP_HEIGHT}}>
        <FlatList
          data={topPicks}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            if (!bookController.checkThumbnail(item)) {
              return null;
            }
            const inputRange = [
              (index - 2) * ITEM_SIZE,
              (index - 1) * ITEM_SIZE,
            ];
            const translateX = scrollX.interpolate({
              inputRange,
              outputRange: [-width, 0],
            });
            return (
              <MaskedView
                style={{position: 'absolute'}}
                maskElement={
                  <AnimatedSvg
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    style={{transform: [{translateX}]}}>
                    <Rect
                      x="0"
                      y="0"
                      width={width}
                      height={height}
                      fill="red"
                    />
                  </AnimatedSvg>
                }>
                <Image
                  style={{width, height: BACKDROP_HEIGHT, resizeMode: 'cover'}}
                  source={{uri: bookController.checkThumbnail(item)}}
                />
              </MaskedView>
            );
          }}
        />
        <LinearGradient
          colors={['transparent', 'white']}
          style={{
            width,
            height: BACKDROP_HEIGHT,
            position: 'absolute',
            bottom: 0,
          }}
        />
      </View>
    );
  };

  const getData = (text = 'java') => {
    // setLoading(true);

    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${text}&maxResults=20&orderBy=relevance&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0`;
    axios
      .get(API_URL)
      .then(res => {
        setTimeout(() => {
          setTopPicks([
            {key: 'left-spacer'},
            res.data.items,
            {key: 'right-spacer'},
          ]);
        }, 1000);

        // setLoading(false);
      })
      .catch(err => {
        console.log(err);
        // setError(true);
        // setLoading(false);
      });
  };

  const bookPreview = ({item, index}) => {
    if (!item.title) {
      return <View style={{width: SPACER_ITEM_SIZE}} />;
    }
    const inputRange = [
      (index - 2) * ITEM_SIZE,
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
    ];
    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [100, 50, 100],
    });
    return (
      <Animated.View
        style={{
          width: ITEM_SIZE,
          marginHorizontal: SPACING,
          transfrom: [{translateY}],
        }}>
        <Image
          source={{uri: '' + bookController.checkThumbnail(item)}}
          indicator={ProgressBar.indeterminate}
          indicatorProps={{
            size: 20,
            borderWidth: 0,
            color: 'rgba(150, 150, 150, 1)',
            unfilledColor: 'rgba(200, 200, 200, 0.2)',
          }}
          style={{
            height: 175,
            width: 120,
            margin: 10,
            resizeMode: 'cover',
            alignSelf: 'flex-start',
            borderRadius: 5,
          }}
        />
        <Text
          style={{
            marginLeft: 30,
            fontSize: 12,
            color: 'white',
            fontWeight: 'bold',
          }}>
          {bookController.checkTitle(item)}
        </Text>
      </Animated.View>
    );
  };

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
        <Backdrop topPicks={topPicks} scrollX={scrollX} />
        <Animated.FlatList
          data={topPicks}
          renderItem={bookPreview}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_SIZE}
          decelerationRate={0}
          bounces={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: true},
          )}
          scrollEventThrottle={16}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          width: width,
          height: 90,
          justifyContent: 'center',
          margin: 15,
        }}>
        <FlatList
          data={list}
          renderItem={selectedTopics}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{alignContent: 'center'}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pickedBooks: {flex: 0.6, backgroundColor: '#EE8BAD'},
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
