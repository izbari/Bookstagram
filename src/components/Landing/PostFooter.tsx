import {View, Text, Pressable} from 'react-native';
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
import {useNavigation} from '@react-navigation/native';
import {INavigationType} from '../navigation/Types';
import {RouteNames} from '../navigation/RouteNames';
import {Colors} from '../../resources/constants/Colors';
interface IPostFooterProps {
  readonly item: IPost | undefined;
  readonly setBottomSheetVisible: (postId: string | undefined) => void;
  readonly onCommentPress: () => void;
}
export const PostFooter: React.FunctionComponent<IPostFooterProps> = React.memo(
  props => {
    // const [likeMutation] = useLikePostMutation();
    const {t} = useTranslation(['translation']);
    const navigation = useNavigation<INavigationType>();

    const authId =
      typeof auth().currentUser === 'object'
        ? auth()?.currentUser?.uid ?? ''
        : '';
    const hasLike = props.item?.likes?.length !== 0;
    const hasComment = props.item?.comments?.length !== 0;
    const [handleLike] = useHandleLikeMutation();

    const onSharePress = React.useCallback(() => {
      props.setBottomSheetVisible(props?.item?.id);
    }, [props]);

    const handleLikePress = React.useCallback(async () => {
      await handleLike({id: props.item?.id, userId: authId}).unwrap();
    }, [authId, handleLike, props.item?.id]);
    const handleCommentPress = (): void => {
      const index = navigation.getState().index;
      const isNavigated =
        navigation.getState().routeNames[index] === RouteNames.singlePost;
      if (isNavigated) {
        props.onCommentPress();
      }
      navigation.navigate(RouteNames.singlePost, {
        focus: true,
        id: props.item?.id,
      });
    };
    return (
      <View style={tw`flex-1`}>
        {!(hasLike || hasComment) ? null : (
          <Pressable
            onPress={() =>
              navigation.navigate(RouteNames.singlePost, {
                id: props.item?.id,
              })
            }>
            <View
              style={tw`flex-row flex-1 items-center justify-between h-10 px-6`}>
              {hasLike ? (
                <View style={tw`flex-row`}>
                  <Ionicons
                    name="heart-outline"
                    size={20}
                    color={Colors.lightPurple}
                  />
                  <Text style={tw`text-gray-500`}>
                    {props.item?.likes?.length === 0
                      ? ''
                      : ' ' + props.item?.likes?.length}
                  </Text>
                </View>
              ) : (
                <View />
              )}
              <View style={tw`flex-row`}>
                {hasComment ? (
                  <Text style={tw` text-gray-500 ml-2`}>
                    {props.item?.comments?.length + ' ' + t('landing.comments')}
                  </Text>
                ) : (
                  <View />
                )}
              </View>
            </View>
          </Pressable>
        )}
        <View style={tw`h-0.25 bg-gray-200`} />

        <View style={tw`flex-row flex-1 items-center justify-between`}>
          <CustomButton onPress={handleLikePress} style={tw`flex-1`}>
            <View style={tw`flex-row flex-1 justify-center h-10 items-center`}>
              {props.item?.likes?.includes?.(authId) ? (
                <Ionicons name="heart" size={25} color={Colors.lightPurple} />
              ) : (
                <Ionicons
                  name="heart-outline"
                  size={25}
                  color={Colors.lightPurple}
                />
              )}
              <Text style={tw`text-gray-500 ml-2 font-medium`}>
                {t('landing.like')}
              </Text>
            </View>
          </CustomButton>

          <CustomButton onPress={handleCommentPress} style={tw`flex-1`}>
            <View style={tw`flex-row flex-1 justify-center h-10 items-center`}>
              <Octicons name="comment" size={23} color={Colors.lightPurple} />
              <Text style={tw`text-gray-500 ml-2 font-medium`}>
                {t('landing.comment')}
              </Text>
            </View>
          </CustomButton>
          <CustomButton onPress={onSharePress} style={tw`flex-1`}>
            <View style={tw`flex-row flex-1 justify-center h-10 items-center`}>
              <Ionicons
                name="share-social-outline"
                size={25}
                color={Colors.lightPurple}
              />
              <Text style={tw`text-gray-500 ml-2 font-medium`}>
                {t('landing.share')}
              </Text>
            </View>
          </CustomButton>
        </View>
      </View>
    );
  },
  isEqual,
);
