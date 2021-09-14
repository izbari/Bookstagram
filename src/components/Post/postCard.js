import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Image from 'react-native-image-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
const {width} = Dimensions.get('window');

function postCard(props) {
  const [height, setHeight] = React.useState(0);

  const [postText, setPostText] = React.useState('');

  return (
    <View
      style={{
        margin: 15,
        alignSelf: 'center',
        width: width * 0.85,
        height: height + 60 + 300 + 60,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#CBCBCB',
        elevation: 25,
      }}>
      <View style={{flexDirection: 'row', padding: 12, paddingBottom: 0}}>
        <Image
          style={{
            height: 50,
            width: 50,
            resizeMode: 'contain',
            borderRadius: 50,
            overflow: 'hidden',
            elavation: 5,
            marginTop: 10,
            marginLeft: 10,
          }}
          source={{uri: 'https://randomuser.me/api/portraits/men/45.jpg'}}
        />
        <View style={{justifyContent: 'center', margin: 10, marginBottom: 0}}>
          <Text>User name</Text>
          <Text>5 gün önce</Text>
        </View>
      </View>

      <View
        style={{
          width: width * 0.85,
          height: height,
        }}>
        <TextInput
          onContentSizeChange={event => {
            setHeight(event.nativeEvent.contentSize.height);
          }}
          style={{height: Math.max(35, height), padding: 15}}
          value={postText}
          multiline
          autoCorrect
          placeholder={'What are u thinking ?'}
          onChangeText={setPostText}
          defaultValue={postText}
        />
      </View>
      <Image
        style={{
          alignSelf: 'center',
          height: 300,
          width: width * 0.85,
          resizeMode: 'cover',
        }}
        source={{uri: 'https://randomuser.me/api/portraits/men/41.jpg'}}
      />
      <View
        style={{
          flexDirection: 'row',
          width: width * 0.85,
          height: 50,
          backgroundColor: 'white',
          justifyContent: 'space-around',
          borderRadius: 5,
          shadowColor: '#CBCBCB',
          elevation: 25,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name={'heart-outline'}
            size={25}
            color="#FF6EA1"
            style={{alignSelf: 'center'}}
          />
          <Text style={{alignSelf: 'center', marginLeft: 2}}>15 Likes</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Ionicons
            name={'chatbox-outline'}
            size={25}
            color="#FF6EA1"
            style={{alignSelf: 'center'}}
          />
          <Text style={{alignSelf: 'center', marginLeft: 2}}>5 Comments</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {flex: 1},

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
    backgroundColor: 'red',
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

export default postCard;
