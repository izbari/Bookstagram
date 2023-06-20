import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import tw from 'twrnc';

import React from 'react';
import {
  View,
  Share,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {WebView} from 'react-native-webview';
import {Header} from '../../components/BookDetail/Header';
import {Colors} from '../../resources/constants/Colors';

const {width} = Dimensions.get('window');
type IBookDetail = IWithNavigation<RouteNames.bookDetail>;
export const BookDetail: React.FunctionComponent<IBookDetail> = props => {
  const book = props.route.params.item;
  const dispatch = useDispatch();
  const list = useSelector(store => store.favList);
  console.warn(JSON.stringify(book, null, 2));

  const [read, setRead] = React.useState(false);
  const favHandler = item => {
    if (list.includes(item)) {
      dispatch({type: 'REMOVE_FAVORITE', payload: {rmFavBook: item}});
    } else {
      dispatch({type: 'ADD_FAVORITE', payload: {favCard: item}});
    }
  };
  const cartHandler = item => {
    dispatch({type: 'ADD_CART', payload: {cartCard: item}});
  };
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: book.infoLink,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const RenderStart = () => {
    let bookStar = book.averageRating;
    const star = [];
    for (let i = 0; i < 5; i++) {
      console.warn(i, '', bookStar);
      if (bookStar === undefined || bookStar === null) {
        bookStar = 0;
      }
      star.push(
        <Ionicons
          key={i}
          name={
            bookStar === 0
              ? 'star-outline'
              : bookStar >= 1
              ? 'star'
              : 'star-half'
          }
          size={20}
          color={bookStar > 0 ? '#FDCF3E' : '#E5E5E5'}
        />,
      );
      bookStar = bookStar !== 0 ? bookStar - 1 : 0;
    }
    return star;
  };
  const [readMore, setReadMore] = React.useState(false);
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header title={book.title} />
      {!read ? (
        <ScrollView>
          <View
            style={{
              flex: 1,

              padding: 5,
            }}>
            <View
              style={{
                backgroundColor: 'white',
                flex: 1,
              }}>
              <Image
                source={{uri: book.imageURL.replace('http', 'https')}}
                style={{
                  alignSelf: 'center',
                  height: 300,
                  width: width,
                  resizeMode: 'contain',
                  margin: 10,
                  borderRadius: 3,
                }}
              />
              <Text style={tw`text-gray-500 text-center `}>
                {book.categories?.join(', ')}
              </Text>

              <View style={tw`px-4 items-center`}>
                <Text style={tw`text-black text-center text-lg font-semibold`}>
                  {book.title}
                </Text>
                <Text style={tw`text-gray-600`}>
                  {book?.authors?.join(', ')}
                </Text>
                <View style={tw`flex-row items-center self-center`}>
                  <RenderStart />
                  <Text style={tw`ml-0.5  mt-0.75 text-gray-400 `}>
                    ({book?.ratingsCount ?? 0})
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'space-around',
                    justifyContent: 'flex-end',
                  }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: Colors.lightPurple,
                      elevation: 20,
                      marginTop: 20,
                      shadowColor: '#52006A',
                      height: 35,
                      borderRadius: 5,
                      shadowColor: 'black',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                    onPress={() => cartHandler(book)}>
                    <View>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 12,
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}>
                        Add to cart
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      flex: 1,
                      marginTop: 20,
                      elevation: 20,
                      shadowColor: '#52006A',
                      backgroundColor: 'white',
                      flex: 1,
                      height: 35,
                      justifyContent: 'center',
                      borderRadius: 5,
                      borderColor: Colors.lightPurple,
                      borderWidth: 2,
                    }}
                    onPress={() => setRead(true)}>
                    <View>
                      <Text
                        style={{
                          color: Colors.lightPurple,
                          fontSize: 12,
                          textAlign: 'center',
                          fontWeight: '900',
                        }}>
                        Read
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <Text
                  style={tw`self-start my-4 bg-purple-50 rounded-full pl-1 font-semibold`}>
                  Book Description
                </Text>
                <Text
                  numberOfLines={readMore ? undefined : 5}
                  style={tw`italic `}>
                  {book.description.trim()}
                </Text>
                <Text
                  onPress={() => setReadMore(curr => !curr)}
                  style={tw`text-gray-600 self-start underline`}>
                  {readMore ? 'read less' : 'read more...'}
                </Text>
              </View>
              <View style={tw`h-0.25 mt-5 mx-4 mb-2 bg-purple-200 `} />
              <View style={tw`px-5 mb-10 `}>
                <Text
                  style={tw`self-start my-4 bg-purple-50 rounded-full pl-1 font-semibold`}>
                  Book Information
                </Text>
                <View style={tw`h-0.5 bg-gray-300  mx-4`} />
                <View style={tw``}>
                  <View style={tw`pl-4 flex-row flex-1 items-center`}>
                    <Text style={tw`bg-purple-100 mr-6 py-4 px-4 min-w-25`}>
                      Publisher
                    </Text>
                    <Text style={tw``}>{book.publisher}</Text>
                  </View>
                  <View style={tw`h-0.5 bg-gray-300  mx-4`} />

                  <View style={tw`pl-4 flex-row flex-1 items-center`}>
                    <Text style={tw`bg-purple-100 mr-6 py-4 px-4 min-w-25	`}>
                      Language
                    </Text>
                    <Text style={tw``}>{book.language}</Text>
                  </View>
                  <View style={tw`h-0.5 bg-gray-300  mx-4`} />

                  <View style={tw`pl-4 flex-row flex-1 items-center`}>
                    <Text style={tw`bg-purple-100 mr-6 py-4 px-4  min-w-25`}>
                      {'Page Count'.replace(' ', '\n')}
                    </Text>
                    <Text style={tw``}>{book.pageCount}</Text>
                  </View>
                  <View style={tw`h-0.5 bg-gray-300 mx-4`} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <WebView source={{uri: book.accessInfo.webReaderLink}} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: Colors.lightPurple},
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
