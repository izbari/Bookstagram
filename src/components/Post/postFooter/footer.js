import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import auth from '@react-native-firebase/auth';
import {Divider} from 'react-native-paper';
const {width} = Dimensions.get('window');

const footer = (props) => {
  return (
    <SafeAreaView>
      {props.item.comments == 0 && props.item.likes == 0 ? null : (
        <TouchableOpacity
          onPress={() => {
            props.setModalVisible(!props.modalVisible);
            props.setSelectedPost(props.item);
          }}
          style={{
            width: width * 0.9,
            height: 25,
            flexDirection: 'row',
            margin: 7,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {props.item?.likes?.length != 0 ? (
            <View style={{flexDirection: 'row', marginLeft: 10}}>
              <EvilIcons name="like" color="#FF6EA1" size={25} />
              <Text style={{alignSelf: 'center', color: '#727375'}}>
                {props.item?.likes?.length == 0
                  ? ''
                  : props.item?.likes?.length}
              </Text>
            </View>
          ) : (
            <View></View>
          )}
          <View style={{flexDirection: 'row', marginRight: 20}}>
            {props.item.comments.length != 0 && (
              <Text
                style={{alignSelf: 'center', marginLeft: 5, color: '#727375'}}>
                {props.item.comments.length + ' Comments'}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}
      <Divider />

      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          height: 50,

          alignItems: 'center',

          justifyContent: 'space-between',
          borderRadius: 5,
          shadowColor: '#CBCBCB',
          elevation: 25,
        }}>
        <TouchableOpacity
          onPress={() => props.likeHandler(props.item.id, props.item.likes)}
          style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
          <AntDesign
            name={
              props.item.likes.includes(auth().currentUser.uid)
                ? 'like1'
                : 'like2'
            }
            size={25}
            color="#FF6EA1"
          />
          <Text
            style={{
              alignSelf: 'center',
              marginLeft: 5,
              fontWeight: 'bold',
              color: 'grey',
            }}>
            {'Like'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            console.log("index:",props.index)
            props.setSelectedPost(props.item);//buna gerek yok
            props.setHomeIndex(props.index)
            props.setShowCommentInput((prev)=> !prev)
          }}
          style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
          <Ionicons name={'chatbox-outline'} size={23} color="#FF6EA1" />
          <Text
            style={{
              alignSelf: 'center',
              marginLeft: 5,
              fontWeight: 'bold',
              color: 'grey',
            }}>
            {'Comment'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMenu(true)}
          style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
          <MaterialCommunityIcons
            name={'share-outline'}
            size={30}
            color="#FF6EA1"
          />
          <Text
            style={{
              alignSelf: 'center',
              marginLeft: 5,
              fontWeight: 'bold',
              color: 'grey',
            }}>
            {'Share'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default footer;
