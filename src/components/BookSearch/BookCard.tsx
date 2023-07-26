import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
// import {Rating} from 'react-native-rating-element';
import FastImage from 'react-native-fast-image';
import {useDispatch} from 'react-redux';
import {
  checkAuthor,
  checkDescription,
  checkPrice,
  checkTitle,
} from '../../infrastructure/Controllers/BookController';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../resources/constants/Colors';
import {RouteNames} from '../navigation/RouteNames';
import {INavigationType} from '../navigation/Types';
import {useNavigation} from '@react-navigation/native';
const BookCard = ({item, navigate, list, handleFavorite, isFavorited}) => {
  const navigation = useNavigation<INavigationType>();
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
            source={
              item?.volumeInfo?.imageLinks?.thumbnail?.replace('http', 'https')
                ? {
                    uri: item?.volumeInfo?.imageLinks?.thumbnail?.replace(
                      'http',
                      'https',
                    ),
                  }
                : require('../../resources/assets/images/imagePlaceholder.jpg')
            }
            // onLoadEnd={() => {
            //   console.warn(checkThumbnail(item));
            //   setSource(checkThumbnail(item));
            // }}
            style={{
              height: 175,
              width: 120,
              alignSelf: 'flex-start',
              borderRadius: 5,
            }}
            resizeMode="cover"
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
              {checkTitle(item)}
            </Text>
            <TouchableOpacity
              onPress={() => handleFavorite(item?.id)}
              style={{}}>
              <Ionicons
                name={isFavorited ? 'heart' : 'heart-outline'}
                size={30}
                color={Colors.lightPurple}
              />
            </TouchableOpacity>
          </View>
          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text
                  style={{marginBottom: 10, color: '#A0A0A1', fontSize: 10}}>
                  {checkAuthor(item)}
                </Text>

                {/* <Rating
                  rated={5}
                  totalCount={2.5}
                  ratingColor="#FF6DA0"
                  ratingBackgroundColor="#d4d4d4"
                  size={15}
                  readonly
                  icon="ios-star"
                  direction="row"
                /> */}
              </View>

              <View>
                <Text style={{fontSize: 12, color: 'grey'}}>
                  {checkPrice(item)}
                </Text>
              </View>
            </View>
          </View>
          <Text style={{marginBottom: 5, marginTop: 10, fontSize: 10}}>
            {checkDescription(item)}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignContent: 'space-around',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              style={{
                marginTop: 17,
                backgroundColor: Colors.lightPurple,
                elevation: 20,
                shadowColor: '#52006A',
                flex: 1,
                height: 35,
                borderRadius: 5,
                justifyContent: 'center',
                marginRight: 10,
              }}
              onPress={() =>
                navigation.navigate(RouteNames.bookDetail, {
                  item: item,
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
                justifyContent: 'center',
                marginRight: 10,
              }}
              onPress={() => handleFavorite(item?.id)}>
              <View>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 12,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  {isFavorited ? 'Remove' : 'Add to Favorite'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
export default React.memo(BookCard);
