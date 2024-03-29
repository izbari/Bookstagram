import {
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Dimensions,
} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {PostSkeleton} from '../../components/Landing/PostSkeleton';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {INavigationType} from '../../components/navigation/Types';
import {Post} from '../../components/Landing/Post';
import {useGetPostsQuery} from '../../infrastructure/Redux/Slices/PostSlice';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import {Colors} from '../../resources/constants/Colors';
import {MemoizedShareContent} from './ShareContent';
import {View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
interface ILandingPageProps {
  readonly navigation: INavigationType;
}
const {height} = Dimensions.get('window');
export const LandingPage: React.FunctionComponent<
  ILandingPageProps
> = props => {
  const {refetch, isLoading, data} = useGetPostsQuery();
  const authUser = useAppSelector(store => store.user.user);
  const [postLimit, setPostLimit] = React.useState(5);
  const posts = data?.slice(0, postLimit);
  const [selectedPostId, setSelectedPostId] = React.useState('');
  //bottom sheet variables
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ['50%', '100%'], []);
  console.warn(authUser?.fallowing.length);
  const handleBottomSheetMode = (postId: string | undefined) => {
    postId && setSelectedPostId(postId);
    const bottomSheetIndex = authUser?.fallowing
      ? authUser?.fallowing?.length > 5
        ? 1
        : 0
      : 0;
    bottomSheetRef.current?.snapToIndex(bottomSheetIndex);
  };
  const fallowings = authUser?.fallowing ?? [];
  const isFocused = useIsFocused();
  console.log(authUser?.fallowing);
  React.useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [authUser?.id, isFocused, refetch]);
  if (isLoading) {
    return <PostSkeleton />;
  }

  return (
    <View style={tw`flex-1`}>
      <FlatList
        data={posts?.slice(0, postLimit)}
        keyExtractor={item => item.id}
        onEndReached={() => {
          setPostLimit(limit => Math.max(limit + 5, data?.length || 0));
        }}
        renderItem={({item, index}) => (
          <Post
            key={index}
            item={item}
            setBottomSheetVisible={handleBottomSheetMode}
          />
        )}
        ListFooterComponent={
          posts?.length === data?.length ? null : (
            <ActivityIndicator color={Colors.lightPurple} />
          )
        }
        refreshControl={
          <RefreshControl
            tintColor={Colors.lightPurple}
            titleColor="grey"
            colors={['#FF6EA1']}
            refreshing={isLoading}
            onRefresh={refetch}
          />
        }
      />
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        containerHeight={height}
        // eslint-disable-next-line react/no-unstable-nested-components
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} disappearsOnIndex={-1} />
        )}
        enablePanDownToClose={true}>
        <MemoizedShareContent
          fallowingIds={fallowings}
          postId={selectedPostId}
        />
      </BottomSheet>
    </View>
  );
};
