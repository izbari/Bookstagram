import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {Comment} from './Comment';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import isEqual from 'react-fast-compare';
import {useGetCommentsByPostIdQuery} from '../../infrastructure/Redux/Slices/PostSlice';
export interface IComment {
  readonly id: string;
  readonly name: string;
  readonly img: string;
  readonly comment: string;
  readonly postTime: FirebaseFirestoreTypes.Timestamp;
  readonly userId: string;
}
interface ICommentContentProps {
  readonly postId: string | undefined;
}
const CommentContent: React.FunctionComponent<ICommentContentProps> = props => {
  const {isLoading, data: comments} = useGetCommentsByPostIdQuery(
    props?.postId,
    {
      skip: !props.postId,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );
  const [limit, setLimit] = React.useState(5);
  const limitedData: IComment[] = limit ? comments?.slice(0, limit) : comments;
  const handleLoadMore = () => {
    setLimit(curLimit => curLimit + 5);
  };
  if (isLoading) {
    return (
      <View style={tw`flex-1 pt-10 items-center justify-center`}>
        <ActivityIndicator color={'gray'} />
        <Text style={tw`text-lg text-gray-500`}>Loading</Text>
      </View>
    );
  }
  if (!limitedData?.length) {
    return (
      <View style={tw`flex-1 pt-10 items-center justify-center`}>
        <Text style={tw`text-lg  text-gray-500`}>Not Comment Yet</Text>
      </View>
    );
  }

  return (
    <BottomSheetFlatList
      data={limitedData}
      keyExtractor={item => item?.id}
      renderItem={({item}) => (
        <Comment
          key={item?.id}
          img={item?.img}
          comment={item?.comment}
          postTime={item?.postTime}
          name={item?.name}
        />
      )}
      onEndReached={handleLoadMore}
    />
  );
};
export const MemoizedCommentContent = React.memo(CommentContent, isEqual);
