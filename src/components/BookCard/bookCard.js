import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Rating} from 'react-native-rating-element';
import bookController from '../../controllers/bookController';
import FastImage from 'react-native-fast-image';
import Icon from '../../components/Icons';
import { useDispatch} from 'react-redux';
const BookCard = ({item, currentScreen, navigate, list}) => {
  const dispatch = useDispatch();
  const [source, setSource] = React.useState(
    require('../../assets/png/imagePlaceholder.jpg'),
  );
  console.log('rerender');
  return (
    <View>
      <View
        style={{
          flex: 0.5,
          flexDirection: 'row',
          height: '70%',
          width: '95%',
          padding: 10,
          justifyContent: 'flex-start',
          marginLeft: 10,
          marginTop: 10,
        }}>
        <View style={{backgroundColor: 'white', flex: 0.8}}>
          <FastImage
            source={source}
            onLoadEnd={() => {
              setSource(bookController.checkThumbnail(item));
            }}
            style={{
              height: 175,
              width: 120,
              resizeMode: 'cover',
              alignSelf: 'flex-start',
              borderRadius: 5,
            }}
          />
        </View>

        <View
          style={{
            justifyContent: 'flex-end',
            backgroundColor: 'white',
            flex: 1.4,
            padding: 10,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{marginBottom: 7, color: '#575758', fontWeight: 'bold'}}>
              {bookController.checkTitle(item)}
            </Text>
            <TouchableOpacity
              onPress={() => {
                list.includes(item)
                  ? dispatch({
                      type: 'REMOVE_FAVORITE',
                      payload: {rmFavBook: item},
                    })
                  : dispatch({type: 'ADD_FAVORITE', payload: {favCard: item}});
              }}
              style={{}}>
              <Icon
                name={list.includes(item) ? 'FilledLike' : 'Like'}
                size={30}
                fill="#FF6EA1"
              />
            </TouchableOpacity>
          </View>
          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text
                  style={{marginBottom: 10, color: '#A0A0A1', fontSize: 10}}>
                  {bookController.checkAuthor(item)}
                </Text>

                <Rating
                  rated={5}
                  totalCount={2.5}
                  ratingColor="#FF6DA0"
                  ratingBackgroundColor="#d4d4d4"
                  size={15}
                  readonly
                  icon="ios-star"
                  direction="row"
                />
              </View>

              <View>
                <Text style={{fontSize: 12, color: 'grey'}}>
                  {bookController.checkPrice(item)}
                </Text>
              </View>
            </View>
          </View>
          <Text style={{marginBottom: 5, marginTop: 10, fontSize: 10}}>
            {bookController.checkDescription(item)}
          </Text>
          {currentScreen === 'Library' && (
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'space-around',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#FF6EA1',
                  elevation: 20,
                  marginTop: 20,
                  shadowColor: '#52006A',
                  borderRadius: 5,
                  shadowColor: 'black',
                  height: 35,

                  justifyContent: 'center',
                  marginRight: 10,
                }}
                onPress={() =>
                  dispatch({type: 'ADD_CART', payload: {cartCard: item}})
                }>
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
                }}
                onPress={() =>
                  navigate('SingleBookDesc', {
                    singleBookData: item,
                  })
                }>
                <View>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 12,
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}>
                    Details
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {currentScreen === 'Favorite' && (
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'space-around',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                style={{
                  marginTop: 17,
                  backgroundColor: '#FF6EA1',
                  elevation: 20,
                  shadowColor: '#52006A',
                  flex: 1,
                  height: 35,
                  borderRadius: 5,
                  shadowColor: 'black',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
                onPress={() =>
                  navigate('SingleBookDesc', {
                    singleBookData: item,
                  })
                }>
                <View>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 12,
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}>
                    Details
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  marginTop: 17,
                  backgroundColor: 'white',
                  elevation: 20,
                  shadowColor: '#52006A',
                  flex: 1,
                  height: 35,
                  borderRadius: 5,
                  shadowColor: 'black',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
                onPress={() =>
                  dispatch({
                    type: 'REMOVE_FAVORITE',
                    payload: {rmFavBook: item},
                  })
                }>
                <View>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 12,
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}>
                    Remove
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {currentScreen === 'Store' && (
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'space-around',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                style={{
                  alignSelf: 'flex-end',
                  marginTop: 17,
                  backgroundColor: '#FF6EA1',
                  elevation: 20,
                  shadowColor: '#52006A',
                  flex: 1,
                  height: 35,
                  borderRadius: 5,
                  shadowColor: 'black',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
                onPress={() =>
                  navigate('SingleBookDesc', {
                    singleBookData: item,
                  })
                }>
                <View>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 12,
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}>
                    Details
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  marginTop: 17,
                  backgroundColor: 'white',
                  elevation: 20,
                  shadowColor: '#52006A',
                  flex: 1,
                  height: 35,
                  borderRadius: 5,
                  shadowColor: 'black',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
                onPress={() =>
                  dispatch({type: 'REMOVE_CART', payload: {rmCartBook: item}})
                }>
                <View>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 12,
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}>
                    Remove
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
export default React.memo(BookCard, (prevProps, nextProps) => {
  
  return prevProps?.list.includes(prevProps.item) ===
  nextProps?.list.includes(nextProps.item);;
});
