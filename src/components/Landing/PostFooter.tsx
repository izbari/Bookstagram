import {View, Text} from 'react-native';
import React from 'react';

import auth from '@react-native-firebase/auth';

import {useTranslation} from 'react-i18next';

import isEqual from 'react-fast-compare';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import {CustomButton} from '../Common/CustomButton';
import {IPost} from '../../infrastructure/Service/PostService';
import {useHandleLikeMutation} from '../../infrastructure/Redux/Slices/PostSlice';
type IPostFooterProps = {
  item: IPost;
  onSelectedPostChange: (post: IPost) => void;
  onBottomSheetModeChange: (mode: string) => void;
};
export const PostFooter: React.FunctionComponent<IPostFooterProps> = React.memo(
  ({item, onBottomSheetModeChange, onSelectedPostChange}) => {
    // const [likeMutation] = useLikePostMutation();
    const {t} = useTranslation(['translation']);
    const authId =
      typeof auth().currentUser === 'object'
        ? auth()?.currentUser?.uid ?? ''
        : '';
    const hasLike = item?.likes?.length !== 0;
    const hasComment = item?.comments?.length !== 0;
    const [handleLike] = useHandleLikeMutation();

    const onActionbarPress = () => {
      onBottomSheetModeChange('comment');
      onSelectedPostChange(item);
    };
    const onSharePress = () => {
      onBottomSheetModeChange('share');
      onSelectedPostChange(item);
    };
    const handleLikePress = () => {
      handleLike({id: item.id, userId: authId});
    };

    return (
      <>
        {!(hasLike || hasComment) ? null : (
          <CustomButton onPress={onActionbarPress}>
            <View
              style={tw`flex-row flex-1 items-center justify-between h-10 px-6`}>
              {hasLike ? (
                <View style={tw`flex-row`}>
                  <Ionicons name="heart-outline" size={20} color={'#FF6EA1'} />
                  <Text style={tw`text-gray-500`}>
                    {item?.likes?.length === 0 ? '' : ' ' + item?.likes?.length}
                  </Text>
                </View>
              ) : (
                <View />
              )}
              <View style={tw`flex-row`}>
                {hasComment ? (
                  <Text style={tw` text-gray-500 ml-2`}>
                    {item?.comments?.length + ' ' + t('common:Comments')}
                  </Text>
                ) : (
                  <View />
                )}
              </View>
            </View>
          </CustomButton>
        )}
        <View style={tw`h-0.25 bg-gray-200`} />

        <View style={tw`flex-row flex-1 items-center justify-between`}>
          <CustomButton onPress={handleLikePress} style={tw`flex-1`}>
            <View style={tw`flex-row flex-1 justify-center h-10 items-center`}>
              {item?.likes?.includes?.(authId) ? (
                <Ionicons name="heart" size={25} color={'#FF6EA1'} />
              ) : (
                <Ionicons name="heart-outline" size={25} color={'#FF6EA1'} />
              )}
              <Text style={tw`text-gray-500 ml-2 font-medium`}>
                {t('common:Like')}
              </Text>
            </View>
          </CustomButton>

          <CustomButton
            // onPress={onCommentPress}
            onPress={onActionbarPress}
            style={tw`flex-1`}>
            <View style={tw`flex-row flex-1 justify-center h-10 items-center`}>
              <Octicons name="comment" size={23} color={'#FF6EA1'} />
              <Text style={tw`text-gray-500 ml-2 font-medium`}>
                {t('common:Comment')}
              </Text>
            </View>
          </CustomButton>
          <CustomButton onPress={onSharePress} style={tw`flex-1`}>
            <View style={tw`flex-row flex-1 justify-center h-10 items-center`}>
              <Ionicons name="share-social-outline" size={25} color="#FF6EA1" />
              <Text style={tw`text-gray-500 ml-2 font-medium`}>
                {t('common:Share')}
              </Text>
            </View>
          </CustomButton>
        </View>
      </>
    );
  },
  isEqual,
);
