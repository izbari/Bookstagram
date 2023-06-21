import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useAnimatedKeyboard,
} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import {Post} from '../../components/Landing/Post';
import {Colors} from '../../resources/constants/Colors';
import {
  IPost,
  useGetPostsQuery,
  useHandleAddCommentMutation,
} from '../../infrastructure/Service/PostService';
import tw from 'twrnc';
import FastImage from 'react-native-fast-image';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {MemoizedShareContent} from '../../components/Landing/ShareContent';
import {Comment} from '../../components/Landing/Comment';
import {PostCommentInput} from '../../components/Landing/PostCommentInput';
import {guidGenerator} from '../../infrastructure/Utils/guidGenerator';
type SinglePostProps = IWithNavigation<RouteNames.singlePost>;
export const SinglePost: React.FunctionComponent<SinglePostProps> = props => {
  const textInputRef = React.useRef();
  const authUser = useAppSelector(store => store.user.user);
  const [handleAddCommentMutation] = useHandleAddCommentMutation();
  const isFocused = props.route.params.focus;
  const scrollViewRef = React.useRef();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ['50%', '100%'], []);
  const {data: post} = useGetPostsQuery(undefined, {
    selectFromResult: ({data}: {data: IPost[]}) => ({
      data: data?.find?.(_post => _post.id === props.route.params.id),
    }),
  });
  const keyboard = useAnimatedKeyboard();
  const animatedDynamicPoze = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -keyboard.height.value,
        },
      ],
    };
  });
  const handleBottomSheetMode = () => {
    const bottomSheetIndex = authUser?.fallowing
      ? authUser?.fallowing?.length > 5
        ? 1
        : 0
      : 0;
    bottomSheetRef.current?.snapToIndex(bottomSheetIndex);
  };
  const handleCommentPress = () => {
    textInputRef.current?.focus?.();
  };
  const handleAddComment = (comment: string): void => {
    if (typeof authUser === 'object' && typeof post === 'object') {
      handleAddCommentMutation({
        comment: comment,
        id: post?.id,
        img: authUser?.imageUrl,
        userId: authUser?.id,
      })
        .unwrap()
        .then(() => {
          scrollViewRef.current?.scrollToEnd({animated: true});
        })
        .catch(err => {
          console.warn(err);
        });
    }
  };

  return (
    <SafeAreaView style={[tw`flex-1 bg-white `]}>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: Colors.lightPurple,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => props.navigation?.goBack()}>
          <Ionicons name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'white',
          }}>
          Share
        </Text>
      </View>
      <ScrollView
        //@ts-ignore
        ref={scrollViewRef}
        contentContainerStyle={tw`grow`}>
        <Post
          item={post}
          setBottomSheetVisible={handleBottomSheetMode}
          onCommentPress={handleCommentPress}
        />
        <FlatList
          data={post?.comments}
          scrollEnabled={false}
          keyExtractor={() => guidGenerator()}
          renderItem={({item, index}) => (
            <Comment
              key={index}
              comment={item.comment}
              img={item?.img}
              name={item.name}
              postTime={item.postTime}
            />
          )}
        />
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        // eslint-disable-next-line react/no-unstable-nested-components
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} disappearsOnIndex={-1} />
        )}
        enablePanDownToClose={true}>
        <MemoizedShareContent
          shareData={authUser?.fallowing}
          selectedPost={post}
        />
      </BottomSheet>
      <Animated.View
        style={[
          tw`w-full shadow-xl bg-white absolute bottom-0 z-9`,
          animatedDynamicPoze,
        ]}>
        <PostCommentInput
          imageUrl={authUser?.imageUrl}
          onAddCommentPress={handleAddComment}
          isFocused={isFocused}
        />
      </Animated.View>
    </SafeAreaView>
  );
};
