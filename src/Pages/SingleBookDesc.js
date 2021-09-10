import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {Rating} from 'react-native-rating-element';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

import bookController from '../controllers/bookController';

function SingleBookDesc(props) {
  let singleData = 'boş';
  if (
    typeof props.route.params.singleBookData !== 'undefined' &&
    props.route.params.singleBookData != null
  ) {
    singleData = props.route.params.singleBookData;
  }

  console.log('Gelen data: ', singleData);

  const favHandler = item => {
    dispatch({type: 'ADD_FAVORITE', payload: {favCard: item}});
  };
  const cartHandler = item => {
    dispatch({type: 'ADD_CART', payload: {cartCard: item}});
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
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
            source={{uri: '' + singleData.imageURL}}
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
          <Text style={{marginBottom: 7, color: '#575758', fontWeight: 'bold'}}>
            {singleData.title}
          </Text>
          <Text style={{marginBottom: 10, color: '#A0A0A1', fontSize: 10}}>
            {singleData.author}
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
          <Text style={{marginBottom: 5, marginTop: 10, fontSize: 10}}>
            {singleData.desc}
          </Text>

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
                height: 35,
                borderRadius: 5,
                shadowColor: 'black',
                justifyContent: 'center',
                marginRight: 10,
              }}
              onPress={() => cartHandler(singleData)}>
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
              onPress={() => favHandler(singleData)}>
              <View>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 12,
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}>
                  Add to wishlist
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#FF6EA1'},
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

export default SingleBookDesc;
