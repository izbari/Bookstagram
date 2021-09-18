import * as React from 'react';
import {Text, View, Dimensions, TouchableOpacity} from 'react-native';
import database from '@react-native-firebase/database';

import auth from '@react-native-firebase/auth';
import Image from 'react-native-image-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import moment from 'moment';
const {width} = Dimensions.get('window');

function postCard(props) {
  const TEXT_SIZE =
    props.item.post != null
      ? Math.round(props.item.post.length / 40.0) * 20 + 10
      : 5;

  let user;
  const IMAGE_SIZE = props.item.postImg != null ? 250 : 5;
  database()
    .ref(`/users/${props.item.userId}`)
    .once('value')
    .then(snapshot => {
      user = snapshot.val();
    });
  const defaultImageUrl =
    'https://scontent.ftzx1-1.fna.fbcdn.net/v/t1.30497-1/c59.0.200.200a/p200x200/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=12b3be&_nc_ohc=CxmGyQqlfmQAX-g1lo4&_nc_ht=scontent.ftzx1-1.fna&edm=AHgPADgEAAAA&oh=4403c3ccd0fc5eed2b87a0f3cfbe5198&oe=616AB239';

  return (
    <View
      style={{
        margin: 15,
        alignSelf: 'center',
        width: width * 0.9,
        height: 50 + TEXT_SIZE + IMAGE_SIZE + 50,
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
          source={{
            uri: user ? user.imageUrl : defaultImageUrl,
          }}
        />
        <View style={{justifyContent: 'center', margin: 10, marginBottom: 0}}>
          <Text>{(user.name, user.lastName)}</Text>
          <Text>{moment(props.item.postTime.toDate()).fromNow()}</Text>
        </View>
      </View>

      <View
        style={{
          width: width * 0.9,
          height: TEXT_SIZE,
        }}>
        {props.item.post != null ? (
          <Text style={{padding: 5, color: '#333333'}}>{props.item.post}</Text>
        ) : (
          <View />
        )}
      </View>
      {props.item.postImg != null ? (
        <Image
          style={{
            alignSelf: 'center',
            height: IMAGE_SIZE,
            width: width * 0.9,
            resizeMode: 'cover',
          }}
          source={{uri: props.item.postImg}}
        />
      ) : null}
      <View
        style={{
          flexDirection: 'row',
          width: width * 0.9,
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
        {props.item.userId == auth().currentUser.uid ? (
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => props.onDelete(props.item.id)}>
            <Ionicons
              name={'trash'}
              size={25}
              color="#FF6EA1"
              style={{alignSelf: 'center'}}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

export default postCard;
