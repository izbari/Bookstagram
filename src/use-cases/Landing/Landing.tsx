// import * as React from 'react';
// import {
//   FlatList,
//   View,
//   Text,
//   RefreshControl,
//   StatusBar,
//   SafeAreaView,
// } from 'react-native';

// import firestore from '@react-native-firebase/firestore';
// import database from '@react-native-firebase/database';
// import {useSelector, useDispatch} from 'react-redux';
// // import BottomSheet from 'reanimated-bottom-sheet';

// // import Icon from '../components/Icons';

// import BottomSheet, {
//   BottomSheetBackdrop,
//   BottomSheetScrollView,
// } from '@gorhom/bottom-sheet';
// // import BottomSheetBackdrop from '../components/BottomSheet';
// import {useFocusEffect} from '@react-navigation/native';
// import {PostHeader} from './PostHeader';
// import PostBody from '../../components/Landing/PostBody';
// import {PostFooter} from './PostFooter';
// import ParseFirebaseData from '../../infrastructure/Utils/ParseFirebaseData';
// import {SharePostRow} from './SharePostRow';
// import {IWithNavigation} from '../../components/navigation/IWithNavigation';
// import {RouteNames} from '../../components/navigation/RouteNames';
// import Comment from './Comment';
// import {PostSkeleton} from './PostSkeleton';
// type ILandingPage = IWithNavigation<RouteNames.landing>;
// export const Landing: React.FunctionComponent<ILandingPage> = ({
//   navigation,
// }) => {
//   const dispatch = useDispatch();
//   const authUser = useSelector(store => store.user.user);
//   const friendList = useSelector(state => state.user.user);
//   //bottom sheet variables
//   const bottomSheetRef = React.useRef(null);
//   const snapPoints = React.useMemo(() => ['50%', '100%'], []);

//   //some state variables
//   const [posts, setPosts] = React.useState([]);
//   const [friendsData, setFriendsData] = React.useState([]);
//   const [loading, setLoading] = React.useState(true);

//   const [selectedPost, setSelectedPost] = React.useState({});
//   const [refreshLoading, setRefreshLoading] = React.useState(false);
//   const [bottomSheetMode, setBottomSheetMode] = React.useState(
//     'comment' || 'share',
//   );
//   const POST_LIST = useSelector(store => store.posts); //need change for posts list
//   // First render getPosts and store redux with dispatch
//   React.useEffect(() => {
//     getPosts();
//     // configure();
//   }, [getPosts]);
//   //need to rerender when  post actions happend (like, comment, delete)
//   React.useEffect(() => {
//     // when post actions happend this line will be execute and fetch modified posts
//     if (posts.length != 0 && POST_LIST.length != 0 && POST_LIST !== posts) {
//       getPosts();
//     }
//   }, [POST_LIST, getPosts, posts]);

//   useFocusEffect(
//     React.useCallback(() => {
//       getPosts();
//     }, []),
//   );

//   const handleModal = async mode => {
//     const openHalf = mode === 'comment' ? 1 : 0;
//     bottomSheetRef?.current?.snapToIndex(openHalf);
//     setBottomSheetMode(mode);
//   };

//   const selectedPostHandle = React.useCallback(
//     post => {
//       setSelectedPost(post);
//     },
//     [setSelectedPost],
//   );

//   //new post önemli
//   const onAddCommentPress = comment => {
//     dispatch({
//       type: 'ADD_COMMENT',
//       payload: {postText: comment, item: selectedPost, user: authUser},
//     });
//     bottomSheetRef.current.close();
//   };
//   const handleSheetChanges = React.useCallback(props => {
//     console.log('handleSheetChanges', props);
//   }, []);

//   const getPosts = React.useCallback(async () => {
//     try {
//       const list = [];
//       await firestore()
//         .collection('posts')
//         .orderBy('postTime', 'desc')
//         .get()
//         .then(querySnapshot => {
//           querySnapshot.forEach(doc => {
//             const {
//               likes,
//               comments,
//               post,
//               postImg,
//               postTime,
//               userId,
//               userName,
//               userImageUrl,
//             } = doc.data();
//             list.push({
//               id: doc.id,
//               userId,
//               userName,
//               userImageUrl,
//               postTime,
//               post,
//               postImg,
//               liked: false,
//               likes,
//               comments,
//             });
//           });
//           setPosts(list);
//           setLoading(false);
//           dispatch({type: 'POST_LIST', payload: {posts: list}});
//         });
//     } catch (error) {
//       setLoading(false);
//       setError(true);
//       console.log('ERROR:', error.msg);
//     }
//   });

//   const PostItem = React.useCallback(
//     ({item}) => {
//       return (
//         <View style={'m-2 bg-[#fff] rounded-lg shadow-md'}>
//           <PostHeader item={item} navigation={navigation} />
//           <PostBody item={item} />
//           <PostFooter
//             item={item}
//             handleModal={handleModal}
//             setSelectedPost={selectedPostHandle}
//           />
//         </View>
//       );
//     },
//     [navigation, selectedPostHandle],
//   );

//   const BottomsheetCommentContent = () => {
//     return Object.keys(selectedPost ?? {}).length === 0 ? (
//       <View style={'bg-[#fff] h-full pt-10'}>
//         <View>
//           {/* <Icon
//             name="Comment"
//             size={100}
//             fill="grey"
//             strokeWidth="1"
//             style={tw`self-center`}
//           /> */}
//           <Text style={'text-lg text-center text-gray-500'}>
//             Not Comment Yet
//           </Text>
//         </View>
//       </View>
//     ) : (
//       selectedPost.comments.map((item: {id: any}) => {
//         return <Comment key={item.id} item={item} />;
//       })
//     );
//   };
//   const BottomsheetShareContent = () => {
//     let data = [];
//     if (friendList.fallowing.length != 0) {
//       database()
//         .ref('/users/')
//         .once('value')
//         .then(snapshot => {
//           data = ParseFirebaseData(snapshot.val());
//           data = data.filter(item => {
//             return Object.keys(friendList.fallowing).includes(item.id);
//           });
//           setFriendsData(data);
//         });
//     }
//     return friendsData.map(friend => {
//       return (
//         <SharePostRow key={friend.id} friend={friend} post={selectedPost} />
//       );
//     });
//   };

//   const onRefresh = async () => {
//     setRefreshLoading(true);
//     await getPosts();
//     setTimeout(() => {
//       setRefreshLoading(false);
//     }, 5000);
//   };

//   if (refreshLoading) {
//     return <PostSkeleton />;
//   }
//   return (
//     <SafeAreaView style={'flex-1'}>
//       <StatusBar backgroundColor="#ff6ea1" barStyle="light-content" />
//       {loading ? (
//         <PostSkeleton />
//       ) : (
//         <View>
//           <FlatList
//             data={posts}
//             renderItem={PostItem}
//             keyExtractor={item => item.id}
//             refreshControl={
//               <RefreshControl
//                 title="Pull to refresh"
//                 tintColor="#FF6EA1"
//                 titleColor="grey"
//                 colors={['#FF6EA1']}
//                 refreshing={refreshLoading}
//                 onRefresh={onRefresh}
//               />
//             }
//           />
//           <BottomSheet
//             ref={bottomSheetRef}
//             index={-1}
//             snapPoints={snapPoints}
//             enablePanDownToClose={true}
//             backdropComponent={backdropProps => (
//               <BottomSheetBackdrop
//                 {...backdropProps}
//                 enableTouchThrough={true}
//               />
//             )}
//             footerComponent={() =>
//               bottomSheetMode === 'comment' ? (
//                 <BottomsheetCommentAction
//                   onAddCommentPress={onAddCommentPress}
//                   imageUrl={authUser?.imageUrl}
//                 />
//               ) : null
//             }
//             onChange={handleSheetChanges}>
//             <BottomSheetScrollView contentContainerStyle={'pb-20 bg-[#fff] '}>
//               {bottomSheetMode === 'comment' ? (
//                 <BottomsheetCommentContent />
//               ) : (
//                 <BottomsheetShareContent />
//               )}
//             </BottomSheetScrollView>
//           </BottomSheet>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };
// import {
//   SafeAreaView,
//   ActivityIndicator,
//   RefreshControl,
//   View,
//   Text,
// } from 'react-native';
// import React from 'react';
// import {FlashList} from '@shopify/flash-list';
// import tw from 'twrnc';
// import {PostSkeleton} from '../../components/Landing/PostSkeleton';
// import BottomSheet, {
//   BottomSheetBackdrop,
//   BottomSheetScrollView,
// } from '@gorhom/bottom-sheet';
// import database from '@react-native-firebase/database';
// import {IWithNavigation} from '../../components/navigation/Types';
// import {RouteNames} from '../../components/navigation/RouteNames';
// import {Post} from '../../components/Landing/Post';
// import {
//   useGetPostsQuery,
//   useHandleAddCommentMutation,
// } from '../../infrastructure/Redux/Slices/PostSlice';
// import {IPost} from '../../infrastructure/Service/PostService';
// import {SharePostRow} from '../../components/Landing/SharePostRow';
// import ParseFirebaseData from '../../infrastructure/Utils/ParseFirebaseData';
// import Octicons from 'react-native-vector-icons/Octicons';
// import {BottomsheetCommentAction} from '../../components/Landing/BottomSheetCommentAction';
// import {Comment} from '../../components/Landing/Comment';
// import {useAppSelector} from '../../infrastructure/Redux/Hooks';
// import {IUser} from '../../infrastructure/Redux/Slices/UserSlice';
// type ILandingPage = IWithNavigation<RouteNames.landing>;

// export const Landing: React.FunctionComponent<ILandingPage> = () => {
//   const {refetch, isLoading, data} = useGetPostsQuery();
//   const authUser = useAppSelector(store => store.user.user);
//   const [friendsData, setFriendsData] = React.useState<IUser[]>([]);
//   const [limit, setLimit] = React.useState(5);
//   const posts = data?.slice(0, limit);
//   //bottom sheet variables
//   const bottomSheetRef = React.useRef(null);
//   const snapPoints = React.useMemo(() => ['50%', '100%'], []);
//   const [selectedPost, setSelectedPost] = React.useState<IPost>();
//   const [refreshLoading, setRefreshLoading] = React.useState(false);
//   const [bottomSheetMode, setBottomSheetMode] = React.useState<
//     'comment' | 'share'
//   >('comment');
//   const [handleComment] = useHandleAddCommentMutation();
//   const handleBottomSheetMode = (mode: 'comment' | 'share') => {
//     const openHalf = mode === 'comment' ? 1 : 0;
//     bottomSheetRef?.current?.snapToIndex(openHalf);
//     setBottomSheetMode(mode);
//   };

//   const selectedPostHandle = React.useCallback(
//     (post: IPost) => {
//       setSelectedPost(post);
//     },
//     [setSelectedPost],
//   );
//   const handleSheetChanges = React.useCallback((props: any) => {
//     console.log('handleSheetChanges', props);
//   }, []);
//   if (isLoading) {
//     return <ActivityIndicator color={'red'} style={tw`mt-20`} />;
//   }
//   //new post önemli
//   const handleAddComment = (comment: string) => {
//     if (!authUser) {
//       return;
//     }
//     handleComment({
//       comment,
//       name: authUser.name,
//       lastName: authUser.lastName,
//       postId: selectedPost.id,
//       userId: authUser.id,
//       img: authUser.imageUrl,
//     });
//     bottomSheetRef.current?.close();
//   };
//   // eslint-disable-next-line react/no-unstable-nested-components
//   const BottomsheetCommentContent = () => {
//     return Object.keys(selectedPost ?? {}).length === 0 ? (
//       <View style={tw`bg-[#fff] h-full pt-10`}>
//         <View>
//           {/* <Ionicons
//             name="Comment"
//             size={100}
//             fill="grey"
//             strokeWidth="1"
//             style={tw`self-center`}
//           /> */}
//           <Octicons name="comment" size={23} color={'#FF6EA1'} />

//           <Text style={tw`text-lg text-center text-gray-500`}>
//             Not Comment Yet
//           </Text>
//         </View>
//       </View>
//     ) : (
//       selectedPost &&
//         selectedPost?.comments.map(item => {
//           return <Comment key={item?.id} item={item} />;
//         })
//     );
//   };
//   const BottomsheetShareContent = () => {
//     let _data = [];
//     if (authUser.fallowing.length !== 0) {
//       database()
//         .ref(`/users/`)
//         .once('value')
//         .then(snapshot => {
//           _data = ParseFirebaseData(snapshot.val());
//           _data = _data.filter(item => {
//             return Object.keys(authUser.fallowing).includes(item.id);
//           });
//           setFriendsData(_data);
//         });
//     }
//     return friendsData.map(friend => {
//       return (
//         <SharePostRow key={friend.id} friend={friend} post={selectedPost} />
//       );
//     });
//   };
//   console.log(isLoading);
//   return (
//     <SafeAreaView style={tw`flex-1`}>
//       {isLoading ? (
//         <PostSkeleton />
//       ) : (
//         <>
//           <FlashList
//             data={posts}
//             estimatedItemSize={40}
//             onEndReached={() => {
//               setLimit(currLimit => currLimit + 5);
//             }}
//             renderItem={({item}) => (
//               <Post
//                 item={item}
//                 onBottomSheetModeChange={handleBottomSheetMode}
//                 onSelectedPostChange={selectedPostHandle}
//               />
//             )}
//             ListFooterComponent={<ActivityIndicator color={'red'} />}
//             refreshControl={
//               <RefreshControl
//                 title="Pull to refresh"
//                 tintColor="#FF6EA1"
//                 titleColor="grey"
//                 colors={['#FF6EA1']}
//                 refreshing={isLoading}
//                 onRefresh={refetch}
//               />
//             }
//           />

//           <BottomSheet
//             ref={bottomSheetRef}
//             index={-1}
//             snapPoints={snapPoints}
//             enablePanDownToClose={true}
//             // eslint-disable-next-line react/no-unstable-nested-components
//             backdropComponent={backdropProps => (
//               <BottomSheetBackdrop
//                 {...backdropProps}
//                 enableTouchThrough={true}
//               />
//             )}
//             // eslint-disable-next-line react/no-unstable-nested-components
//             footerComponent={() =>
//               bottomSheetMode === 'comment' ? (
//                 <BottomsheetCommentAction
//                   onAddCommentPress={handleAddComment}
//                   imageUrl={authUser?.imageUrl}
//                 />
//               ) : null
//             }
//             onChange={handleSheetChanges}>
//             <BottomSheetScrollView contentContainerStyle={tw`pb-20 bg-[#fff] `}>
//               {bottomSheetMode === 'comment' ? (
//                 <BottomsheetCommentContent />
//               ) : (
//                 <BottomsheetShareContent />
//               )}
//             </BottomSheetScrollView>
//           </BottomSheet>
//         </>
//       )}
//     </SafeAreaView>
//   );
// };
import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {RouteNames} from '../../components/navigation/RouteNames';
import {IWithNavigation} from '../../components/navigation/Types';
import {LandingPage} from '../../components/Landing/LandingPage';

type ILandingProps = IWithNavigation<RouteNames.landing>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export const Landing: React.FunctionComponent<ILandingProps> = props => {
  return (
    <View style={styles.container}>
      <LandingPage navigation={props.navigation} />
    </View>
  );
};
