import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';


import auth from '@react-native-firebase/auth';
import {Divider} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

import Icon from '../../../components/Icons';
const {width} = Dimensions.get('window');

const footer = React.memo(
  ({
    item,
    likeHandler,
    setSelectedPost,
    setHomeIndex,
    setShowCommentInput,
    setModalVisible,
    modalVisible,
    index,
  }) => {
    const {t} = useTranslation();
    console.log(index, 'kere çalıştım');
    return (
      <SafeAreaView>
        {item.comments == 0 && item.likes == 0 ? null : (
          <TouchableOpacity
            onPress={() => {
              setModalVisible(!modalVisible);
              setSelectedPost(item);
            }}
            style={{
              width: width * 0.9,
              height: 25,
              flexDirection: 'row',
              margin: 7,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {item?.likes?.length != 0 ? (
              <View style={{flexDirection: 'row', marginLeft: 10}}>
                <Icon name='Like'   size={20}    fill={'#FF6EA1'}
/>
                <Text style={{alignSelf: 'center', color: '#727375'}}>
                  {item?.likes?.length == 0 ? '' : " "+item?.likes?.length}
                </Text>
              </View>
            ) : (
              <View></View>
            )}
            <View style={{flexDirection: 'row', marginRight: 20}}>
              {item.comments.length != 0 && (
                <Text
                  style={{
                    alignSelf: 'center',
                    marginLeft: 5,
                    color: '#727375',
                  }}>
                  {item.comments.length + ' ' + t('common:Comments')}
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
            onPress={() => likeHandler(item.id, item.likes)}
            style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
            {item.likes.includes(auth().currentUser.uid) ?
            <Icon
              name='FilledLike'
              size={25}
              fill={'#FF6EA1'}
            /> :      <Icon name='Like'   size={25}    fill={'#FF6EA1'} />
          }
            <Text
              style={{
                alignSelf: 'center',
                marginLeft: 5,
                fontWeight: 'bold',
                color: 'grey',
              }}>
              {t('common:Like')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSelectedPost(item); //buna gerek yok
              setHomeIndex(index);
              setShowCommentInput(prev => !prev);
            }}
            style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
             <Icon
              name='Comment'
              size={23}
              fill={'#FF6EA1'}
            /> 
            <Text
              style={{
                alignSelf: 'center',
                marginLeft: 5,
                fontWeight: 'bold',
                color: 'grey',
              }}>
              {t('common:Comment')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMenu(true)}
            style={{flexDirection: 'row', flex: 1, justifyContent: 'center'}}>
            <Icon
              name='Share'
              size={25}
              fill="#FF6EA1"
            />
            <Text
              style={{
                alignSelf: 'center',
                marginLeft: 5,
                fontWeight: 'bold',
                color: 'grey',
              }}>
              {t('common:Share')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  },
);

export default footer;
