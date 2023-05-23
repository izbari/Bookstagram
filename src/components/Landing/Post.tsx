import {View} from 'react-native';
import React from 'react';
import {PostHeader} from './PostHeader';
import {PostBody} from './PostBody';
import {PostFooter} from './PostFooter';
import {IPost} from '../../infrastructure/Service/PostService';
import tw from 'twrnc';
interface IPostProps {
  readonly item: IPost;
  readonly onBottomSheetModeChange: (mode: string) => void;
  readonly onSelectedPostChange: (post: IPost) => void;
}
export const Post: React.FunctionComponent<IPostProps> = props => {
  return (
    <View style={tw`m-2 bg-[#fff] rounded-lg shadow-md`}>
      <PostHeader
        postTime={props.item.postTime}
        userId={props.item.userId}
        userImageUrl={props.item.userImageUrl}
        userName={props.item.userName}
      />
      <PostBody post={props.item.post} postImg={props.item.postImg} />
      <PostFooter
        item={props.item}
        onBottomSheetModeChange={props.onBottomSheetModeChange}
        onSelectedPostChange={props.onSelectedPostChange}
      />
    </View>
  );
};
