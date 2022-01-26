import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Rating} from 'react-native-rating-element';
import bookController from '../../controllers/bookController';
import Image from 'react-native-image-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
const BookCard = props => {
  const list = useSelector(store => store.favList);
  return (
    <TouchableOpacity onPress={props.toNavigateBookHandler}>
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
          <Image
            source={{uri: '' + bookController.checkThumbnail(props.item)}}
          
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
              {bookController.checkTitle(props.item)}
            </Text>
            <TouchableOpacity
              onPress={() => props.favHandler(props.item)}
              style={{}}>
              <Ionicons
                name={list.includes(props.item) ? 'heart' : 'heart-outline'}
                size={30}
                color="#FF6EA1"
              />
            </TouchableOpacity>
          </View>
        <View>

        <View style={{flexDirection: 'row',justifyContent: 'space-between',}}>
        <View>
        <Text style={{marginBottom: 10, color: '#A0A0A1', fontSize: 10}}>
            {bookController.checkAuthor(props.item)}
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
        
         <View >
            <Text style={{fontSize:12, color: 'grey'}}>{bookController.checkPrice(props.item)}</Text>

         </View>
 </View>
        </View>
          <Text style={{marginBottom: 5, marginTop: 10, fontSize: 10}}>
            {bookController.checkDescription(props.item)}
          </Text>
          {props.from === 'library' && (
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
                onPress={() => props.cartHandler(props.item)}>
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
                onPress={() => props.cartDetailsHandler(props.item)}>
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
          {props.from === 'favorites' && (
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
                onPress={() => props.toNavigateBookDetails(props.item)}>
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
                onPress={() => props.removeFromFavorites(props.item)}>
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
          {props.from === 'store' && (
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
                onPress={() => props.toNavigateBookDetails(props.item)}>
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
                onPress={() => props.removeFromCart(props.item)}>
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
    </TouchableOpacity>
  );
};
export default BookCard;
