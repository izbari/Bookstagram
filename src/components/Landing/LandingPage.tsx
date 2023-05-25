import {
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  View,
  Text,
} from 'react-native';
import React from 'react';
import {FlashList} from '@shopify/flash-list';
import tw from 'twrnc';
import {PostSkeleton} from '../../components/Landing/PostSkeleton';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import database from '@react-native-firebase/database';
import {INavigationType} from '../../components/navigation/Types';
import {Post} from '../../components/Landing/Post';
import {
  useGetPostsQuery,
  useHandleAddCommentMutation,
} from '../../infrastructure/Redux/Slices/PostSlice';
import {IPost} from '../../infrastructure/Service/PostService';
import {SharePostRow} from '../../components/Landing/SharePostRow';
import ParseFirebaseData from '../../infrastructure/Utils/ParseFirebaseData';
import Octicons from 'react-native-vector-icons/Octicons';
import {BottomsheetCommentAction} from '../../components/Landing/BottomSheetCommentAction';
import {Comment} from '../../components/Landing/Comment';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import {IUser} from '../../infrastructure/Redux/Slices/UserSlice';
import auth from '@react-native-firebase/auth';
interface ILandingPageProps {
  readonly navigation: INavigationType;
}
export const LandingPage: React.FunctionComponent<
  ILandingPageProps
> = props => {
  const {refetch, isLoading, data} = useGetPostsQuery();
  const authUser = useAppSelector(store => store.user.user);
  const [friendsData, setFriendsData] = React.useState<IUser[]>([]);
  const [limit, setLimit] = React.useState(5);
  const posts = data?.slice(0, limit);
  //bottom sheet variables
  const bottomSheetRef = React.useRef(null);
  const snapPoints = React.useMemo(() => ['50%', '100%'], []);
  const [selectedPost, setSelectedPost] = React.useState<IPost>();
  const [refreshLoading, setRefreshLoading] = React.useState(false);
  const [bottomSheetMode, setBottomSheetMode] = React.useState<
    'comment' | 'share'
  >('comment');
  const [handleComment] = useHandleAddCommentMutation();
  const handleBottomSheetMode = (mode: 'comment' | 'share') => {
    const openHalf = mode === 'comment' ? 1 : 0;
    bottomSheetRef?.current?.snapToIndex(openHalf);
    setBottomSheetMode(mode);
  };

  const selectedPostHandle = React.useCallback(
    (post: IPost) => {
      setSelectedPost(post);
    },
    [setSelectedPost],
  );

  const handleSheetChanges = React.useCallback((props: any) => {
    console.log('handleSheetChanges', props);
  }, []);
  if (isLoading) {
    return <ActivityIndicator color={'red'} style={tw`mt-20`} />;
  }
  //new post önemli
  const handleAddComment = (comment: string) => {
    if (!authUser) {
      return;
    }
    handleComment({
      comment,
      name: authUser.name,
      lastName: authUser.lastName,
      postId: selectedPost.id,
      userId: authUser.id,
      img: authUser.imageUrl,
    });
    bottomSheetRef.current?.close();
  };
  // eslint-disable-next-line react/no-unstable-nested-components
  const BottomsheetCommentContent = () => {
    return Object.keys(selectedPost ?? {}).length === 0 ? (
      <View style={tw`bg-[#fff] h-full pt-10`}>
        <View>
          {/* <Ionicons
            name="Comment"
            size={100}
            fill="grey"
            strokeWidth="1"
            style={tw`self-center`}
          /> */}
          <Octicons name="comment" size={23} color={'#FF6EA1'} />

          <Text style={tw`text-lg text-center text-gray-500`}>
            Not Comment Yet
          </Text>
        </View>
      </View>
    ) : (
      selectedPost &&
        selectedPost?.comments.map(item => {
          return <Comment key={item?.id} item={item} />;
        })
    );
  };
  const BottomsheetShareContent = () => {
    let _data = [];
    if (authUser.fallowing.length !== 0) {
      database()
        .ref(`/users/`)
        .once('value')
        .then(snapshot => {
          _data = ParseFirebaseData(snapshot.val());
          _data = _data.filter(item => {
            return Object.keys(authUser.fallowing).includes(item.id);
          });
          setFriendsData(_data);
        });
    }
    return friendsData.map(friend => {
      return (
        <SharePostRow key={friend.id} friend={friend} post={selectedPost} />
      );
    });
  };
  console.log(isLoading);
  return (
    <SafeAreaView style={tw`flex-1`}>
      {isLoading ? (
        <PostSkeleton />
      ) : (
        <>
          <FlashList
            data={posts}
            estimatedItemSize={40}
            onEndReached={() => {
              setLimit(currLimit => currLimit + 5);
            }}
            renderItem={({item}) => (
              <Post
                item={item}
                onBottomSheetModeChange={handleBottomSheetMode}
                onSelectedPostChange={selectedPostHandle}
              />
            )}
            ListFooterComponent={<ActivityIndicator color={'red'} />}
            refreshControl={
              <RefreshControl
                title="Pull to refresh"
                tintColor="#FF6EA1"
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
            enablePanDownToClose={true}
            // eslint-disable-next-line react/no-unstable-nested-components
            backdropComponent={backdropProps => (
              <BottomSheetBackdrop
                {...backdropProps}
                enableTouchThrough={true}
              />
            )}
            // eslint-disable-next-line react/no-unstable-nested-components
            footerComponent={() =>
              bottomSheetMode === 'comment' ? (
                <BottomsheetCommentAction
                  onAddCommentPress={handleAddComment}
                  imageUrl={authUser?.imageUrl}
                />
              ) : null
            }
            onChange={handleSheetChanges}>
            <BottomSheetScrollView contentContainerStyle={tw`pb-20 bg-[#fff] `}>
              {bottomSheetMode === 'comment' ? (
                <BottomsheetCommentContent />
              ) : (
                <BottomsheetShareContent />
              )}
            </BottomSheetScrollView>
          </BottomSheet>
        </>
      )}
    </SafeAreaView>
  );
};
