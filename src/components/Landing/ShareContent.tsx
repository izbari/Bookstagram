import React from 'react';
import isEqual from 'react-fast-compare';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {MemoizedSharePostRow} from './SharePostRow';
import {
  IPost,
  useGetMultipleUsersQuery,
} from '../../infrastructure/Service/PostService';

interface IShareContentProps {
  readonly fallowingIds: string[] | undefined;
  readonly postId: string | undefined;
  readonly limit?: number;
}
const ShareContent: React.FunctionComponent<IShareContentProps> = props => {
  const data = props.limit
    ? props?.fallowingIds?.slice(0, props.limit)
    : props?.fallowingIds;
  const {data: fallowingUserData} = useGetMultipleUsersQuery(
    props.fallowingIds ?? [],
    {skip: !props.fallowingIds?.length},
  );
  return (
    <BottomSheetFlatList
      data={fallowingUserData}
      keyExtractor={item => item?.id as string}
      renderItem={({item: user}) => (
        <MemoizedSharePostRow
          key={user?.id}
          img={user?.imageUrl}
          name={user?.name + ' ' + user?.lastName}
          userId={user?.id}
          postId={props.postId}
          username={user?.username}
        />
      )}
      //   refreshing={false}
      //   onRefresh={() => null}
      //   onEndReached={() => {}}
      //   ListFooterComponent={() => (
      //     <ActivityIndicator color={Colors.darkPurple} />
      //   )}
    />
  );
};

export const MemoizedShareContent = React.memo(ShareContent, isEqual);
