import {View} from 'react-native';
import React from 'react';
import {PostHeader} from './PostHeader';
import {PostBody} from './PostBody';
import {PostFooter} from './PostFooter';
import {IPost} from '../../infrastructure/Service/PostService';
import tw from 'twrnc';
export const Post: React.FunctionComponent<{item: IPost}> = ({item}) => {
  return (
    <View style={tw`m-2 bg-[#fff] rounded-lg shadow-md`}>
      <PostHeader
        postTime={item.postTime}
        userId={item.userId}
        userImageUrl={item.userImageUrl}
        userName={item.userName}
      />
      <PostBody post={item.post} postImg={item.postImg} />
      <PostFooter item={item} />
    </View>
  );
};
