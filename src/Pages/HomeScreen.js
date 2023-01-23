import * as React from 'react';
import {
  FlatList,
  View,
  Text,
  Dimensions,
  RefreshControl,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import Animated from 'react-native-reanimated';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
// import BottomSheet from 'reanimated-bottom-sheet';
import tw from 'twrnc';

import Icon from '../components/Icons';
import firebaseUtil from '../utils/parseFirebaseData';
import SkeletonPlaceholder from '../components/SkeletonPlaceholder';

import PostBody from '../components/Post/postBody';
import PostFooter from '../components/Post/postFooter';
import PostHeader from '../components/Post/postHeader';
import SharePostRow from '../components/Post/SharePostRow';
import Comment from '../components/Post/postComment/';
import BottomsheetCommentAction from '../components/Post/sendComment';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
// import BottomSheetBackdrop from '../components/BottomSheet';
import {useFocusEffect} from '@react-navigation/native';

const {width} = Dimensions.get('window');

function HomeScreen({navigation, route}) {
  const dispatch = useDispatch();
  const authUser = useSelector(store => store.user);
  const friendList = useSelector(state => state.user);
  //bottom sheet variables
  const bottomSheetRef = React.useRef(null);
  const snapPoints = React.useMemo(() => ['50%', '100%'], []);

  //some state variables
  const [posts, setPosts] = React.useState([]);
  const [friendsData, setFriendsData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [selectedPost, setSelectedPost] = React.useState({});
  const [refreshLoading, setRefreshLoading] = React.useState(false);
  const [bottomSheetMode, setBottomSheetMode] = React.useState(
    'comment' || 'share',
  );
  const POST_LIST = useSelector(store => store.posts); //need change for posts list
  // First render getPosts and store redux with dispatch
  React.useEffect(() => {
    getPosts();
    // configure();
  }, []);
  //need to rerender when  post actions happend (like, comment, delete)
  React.useEffect(() => {
    // when post actions happend this line will be execute and fetch modified posts
    if (posts.length != 0 && POST_LIST.length != 0 && POST_LIST !== posts) {
      getPosts();
    }
  }, [POST_LIST]);

  useFocusEffect(
    React.useCallback(() => {
      getPosts();
    }, []),
  );

  const handleModal = async mode => {
    const openHalf = mode === 'comment' ? 1 : 0;
    bottomSheetRef?.current?.snapToIndex(openHalf);
    setBottomSheetMode(mode);
  };

  const selectedPostHandle = React.useCallback(
    post => {
      setSelectedPost(post);
    },
    [setSelectedPost],
  );

  //new post önemli
  const onAddCommentPress = comment => {
    dispatch({
      type: 'ADD_COMMENT',
      payload: {postText: comment, item: selectedPost, user: authUser},
    });
    bottomSheetRef.current.close();
  };
  const handleSheetChanges = React.useCallback(props => {
    console.log('handleSheetChanges', props);
  }, []);

  const getPosts = async () => {
    try {
      const list = [];
      await firestore()
        .collection('posts')
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const {
              likes,
              comments,
              post,
              postImg,
              postTime,
              userId,
              userName,
              userImageUrl,
            } = doc.data();
            list.push({
              id: doc.id,
              userId,
              userName,
              userImageUrl,
              postTime,
              post,
              postImg,
              liked: false,
              likes,
              comments,
            });
          });
          setPosts(list);
          setLoading(false);
          dispatch({type: 'POST_LIST', payload: {posts: list}});
        });
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log('ERROR:', error.msg);
    }
  };

  const PostItem = React.useCallback(
    ({item}) => {
      return (
        <View style={tw`m-2 bg-[#fff] rounded-lg shadow-md`}>
          <PostHeader item={item} navigation={navigation} />
          <PostBody item={item} />
          <PostFooter
            item={item}
            handleModal={handleModal}
            setSelectedPost={selectedPostHandle}
          />
        </View>
      );
    },
    [posts],
  );

  const BottomsheetCommentContent = () => {
    return Object.keys(selectedPost ?? {}).length === 0 ? (
      <View style={tw`bg-[#fff] h-full pt-10`}>
        <View>
          <Icon
            name="Comment"
            size={100}
            fill="grey"
            strokeWidth="1"
            style={tw`self-center`}
          />
          <Text style={tw`text-lg text-center text-gray-500`}>
            Not Comment Yet
          </Text>
        </View>
      </View>
    ) : (
      selectedPost.comments.map(item => {
        return <Comment key={item.id} item={item} />;
      })
    );
  };
  const BottomsheetShareContent = () => {
    let data = [];
    if (friendList.fallowing.length != 0) {
      database()
        .ref(`/users/`)
        .once('value')
        .then(snapshot => {
          data = firebaseUtil(snapshot.val());
          data = data.filter(item => {
            return Object.keys(friendList.fallowing).includes(item.id);
          });
          setFriendsData(data);
        });
    }
    return friendsData.map(friend => {
      return (
        <SharePostRow key={friend.id} friend={friend} post={selectedPost} />
      );
    });
  };

  const onRefresh = async () => {
    setRefreshLoading(true);
    await getPosts();
    setTimeout(() => {
      setRefreshLoading(false);
    }, 5000);
  };

  if (refreshLoading) {
    return <SkeletonPlaceholder />;
  }
  return (
    <SafeAreaView style={tw`flex-1`}>
      <StatusBar backgroundColor="#ff6ea1" barStyle="light-content" />
      {loading ? (
        <SkeletonPlaceholder />
      ) : (
        <View>
          <FlatList
            data={posts}
            renderItem={PostItem}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                title="Pull to refresh"
                tintColor="#FF6EA1"
                titleColor="grey"
                colors={['#FF6EA1']}
                refreshing={refreshLoading}
                onRefresh={onRefresh}
              />
            }
          />
          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={backdropProps => (
              <BottomSheetBackdrop
                {...backdropProps}
                enableTouchThrough={true}
              />
            )}
            footerComponent={() =>
              bottomSheetMode === 'comment' ? (
                <BottomsheetCommentAction
                  onAddCommentPress={onAddCommentPress}
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
        </View>
      )}
    </SafeAreaView>
  );
}

export default HomeScreen;
