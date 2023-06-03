import React from 'react';
import isEqual from 'react-fast-compare';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {MemoizedSharePostRow} from './SharePostRow';
import {IFallowing} from '../../infrastructure/Redux/Slices/UserSlice';
import {guidGenerator} from '../../infrastructure/Utils/guidGenerator';
import {IPost} from '../../infrastructure/Service/PostService';

interface IShareContentProps {
  readonly shareData: IFallowing[] | undefined;
  selectedPost: IPost | undefined;
  readonly limit?: number;
}
const ShareContent: React.FunctionComponent<IShareContentProps> = props => {
  const data = props.limit
    ? props?.shareData?.slice(0, props.limit)
    : props.shareData;
  return (
    <BottomSheetFlatList
      data={data}
      keyExtractor={item => guidGenerator()}
      renderItem={({item, index}) => (
        <MemoizedSharePostRow
          key={index}
          img={item.img}
          name={item.name}
          userId={item.userId}
          post={props.selectedPost}
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
