import {View, Text, TouchableOpacity, Dimensions} from 'react-native';
import React from 'react';

import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';

import {Divider} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

import Icon from '../../../components/Icons';
import isEqual from 'react-fast-compare';
import tw from 'twrnc';
const {width} = Dimensions.get('window');

const Footer = React.memo(
  ({item, setSelectedPost, handleModal, setBottomSheetMode}) => {
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const onActionbarPress = () => {
      handleModal('comment');
      setSelectedPost(item);
    };
    const onSharePress = () => {
      handleModal('share');
      setSelectedPost(item);
    };
    const onLikePress = () => {
      dispatch({type: 'LIKE_HANDLER', payload: {post: item}});
    };

    return (
      <>
        {item?.comments == 0 && item?.likes == 0 ? null : (
          <TouchableOpacity
            onPress={onActionbarPress}
            style={tw`flex-row items-center self-center justify-between h-8 m-2 w-${
              width * 0.85
            }px`}>
            {item?.likes?.length != 0 ? (
              <View style={tw`flex-row`}>
                <Icon name="Like" size={20} fill={'#FF6EA1'} />
                <Text style={tw`text-gray-500 self-center`}>
                  {item?.likes?.length == 0 ? '' : ' ' + item?.likes?.length}
                </Text>
              </View>
            ) : (
              <View></View>
            )}
            <View style={tw`flex-row`}>
              {item.comments.length != 0 ? (
                <Text style={tw`self-center text-gray-500 ml-2`}>
                  {item.comments.length + ' ' + t('common:Comments')}
                </Text>
              ) : (
                <View></View>
              )}
            </View>
          </TouchableOpacity>
        )}
        <Divider />

        <View style={tw`flex-row items-center justify-between h-8 m-2`}>
          <TouchableOpacity
            onPress={onLikePress}
            style={tw`flex-row flex-1 justify-center`}>
            {item.likes.includes(auth().currentUser.uid) ? (
              <Icon name="FilledLike" size={25} fill={'#FF6EA1'} />
            ) : (
              <Icon name="Like" size={25} fill={'#FF6EA1'} />
            )}
            <Text style={tw`self-center text-gray-500 ml-2 font-medium`}>
              {t('common:Like')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={onCommentPress}
            onPress={onActionbarPress}
            style={tw`flex-row flex-1 justify-center`}>
            <Icon name="Comment" size={23} fill={'#FF6EA1'} />
            <Text style={tw`self-center text-gray-500 ml-2 font-medium`}>
              {t('common:Comment')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onSharePress}
            style={tw`flex-row flex-1 justify-center`}>
            <Icon name="Share" size={25} fill="#FF6EA1" />
            <Text style={tw`self-center text-gray-500 ml-2 font-medium`}>
              {t('common:Share')}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  },
);

export default React.memo(Footer, isEqual);
