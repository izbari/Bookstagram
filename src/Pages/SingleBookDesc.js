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
import { WebView } from 'react-native-webview';

import bookController from '../controllers/bookController';

const {width} = Dimensions.get('window').width;
function SingleBookDesc(props) {
  const dispatch = useDispatch();
  const list = useSelector(store => store.favList);

  const [read,setRead] = React.useState(false);

  let singleData = 'boş';
  if (
    typeof props.route.params.singleBookData !== 'undefined' &&
    props.route.params.singleBookData != null
  ) {
    singleData = props.route.params.singleBookData;
  }
  console.log(singleData.volumeInfo);

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
        message: singleData.volumeInfo.infoLink,
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


  

  return (
    <SafeAreaView style={styles.mainContainer}>
      {!read  ? <ScrollView>
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
              source={{uri: '' + bookController.checkThumbnail(singleData)}}
            
              style={{
                height: 300,
                width: width,
                resizeMode: 'contain',
                margin: 20,
                borderRadius: 3,
              }}
            />
            <TouchableOpacity
              onPress={() => favHandler(singleData)}
              style={{position: 'absolute', top: 15, right: 20}}>
              <Ionicons
                name={list.includes(singleData) ? 'heart' : 'heart-outline'}
                size={25}
                color="#FF6EA1"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onShare()}
              style={{position: 'absolute', top: 60, right: 20}}>
              <Ionicons name="share-outline" size={25} color="#FF6EA1" />
            </TouchableOpacity>
            <Text
              style={{
                marginBottom: 0,
                color: '#6C6C6C',
                fontWeight: 'bold',
                padding: 10,
                paddingBottom: 2,
              }}>
              {singleData.volumeInfo.title}
            </Text>
            <Text
              style={{
                marginBottom: 10,
                marginLeft: 10,
                color: '#A0A0A1',
                fontSize: 10,
              }}>
              {singleData.volumeInfo.authors}
            </Text>

            <Text
              style={{
                marginBottom: 5,
                marginTop: 10,
                fontSize: 14,
                padding: 10,
              }}>
              {singleData.volumeInfo.description}
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
                onPress={() => setRead(true)}>
                <View>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 12,
                      textAlign: 'center',
                      fontWeight: 'bold',
                    }}>
                  Read</Text>
                </View>
              </TouchableOpacity>
            </View>
          
          </View>
        </View>
      </ScrollView> : <WebView source={{ uri: singleData.accessInfo.webReaderLink}} />}
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
