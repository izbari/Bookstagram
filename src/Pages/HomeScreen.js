import * as React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Dimensions,
  RefreshControl,
} from 'react-native';

import Animated from 'react-native-reanimated';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {ScrollView} from 'react-native-gesture-handler';
import {useSelector, useDispatch} from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';

import Icon from '../components/Icons';
import firebaseUtil from '../utils/parseFirebaseData';
import SkeletonPlaceholder from '../components/SkeletonPlaceholder';

import PostBody from '../components/Post/postBody';
import PostFooter from '../components/Post/postFooter';
import PostHeader from '../components/Post/postHeader';
import SharePostRow from '../components/Post/SharePostRow';
import Comment from '../components/Post/postComment/';

const {width} = Dimensions.get('window');

function HomeScreen({navigation, route}) {
  const newPost = route?.params?.newPost;
  const friendList = useSelector(state => state.user);
  const dispatch = useDispatch();

  //bottom sheet variables
  const bs = React.useRef(null);
  const fall = new Animated.Value(1);

  //some state variables
  const [posts, setPosts] = React.useState([]);
  const [friendsData, setFriendsData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [handleCommentModal, setHandleCommentModal] = React.useState(false);
  const [handleShareModal, setHandleShareModal] = React.useState(false);

  const [selectedPost, setSelectedPost] = React.useState({});
  const [refreshLoading, setRefreshLoading] = React.useState(false);

  const POST_LIST = useSelector(store => store.posts); //need change for posts list

  // First render getPosts and store redux with dispatch
  React.useEffect(async () => {
    await getPosts();
    dispatch({type: 'POST_LIST', payload: {posts: posts}});
  }, []);

  //need to rerender when  post actions happend (like, comment, delete)
  React.useEffect(async () => {
    // when post actions happend this line will be execute and fetch modified posts
    if (posts.length != 0 && POST_LIST.length != 0 && POST_LIST !== posts) {
      await getPosts();
    } 
  }, [POST_LIST]);

  //New post listener
  React.useEffect(() => {
    if (newPost) {
      onRefresh();
    }
  }, [newPost]);

  const HandleCommentModal = React.useCallback(() => {
    setHandleCommentModal(value => !value);
  }, [setHandleCommentModal]);

  const HandleShareModal = React.useCallback(() => {
    setHandleShareModal(value => !value);
  }, [setHandleShareModal]);

  const selectedPostHandle = React.useCallback(
    post => {
      setSelectedPost(post);
    },
    [setSelectedPost],
  );
  //new post önemli

  const getPosts = async () => {
    try {
      console.log('get posts -------------------------');
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
        });
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log('ERROR:', error.msg);
    }
  };

  const PostItem = ({item}) => {
    return (
      <View
        style={{
          margin: 15,
          alignSelf: 'center',
          width: width * 0.9,

          backgroundColor: 'white',
          borderRadius: 5,
          shadowColor: '#CBCBCB',
          elevation: 25,
        }}>
        <PostHeader item={item} navigation={navigation} />
        <PostBody item={item} />
        <PostFooter
          item={item}
          HandleCommentModal={HandleCommentModal}
          HandleShareModal={HandleShareModal}
          setSelectedPost={selectedPostHandle}
        />
      </View>
    );
  };

  const BottomSheetDragger = () => {
    return (
      <View
        style={{
          height: 50,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name="Drag" size={35} fill="#909090" />
      </View>
    );
  };

  const BottomsheetCommentContent = () => {
    return selectedPost.comments.length == 0 ? (
      <View
        style={{
          backgroundColor: 'white',
          height: '100%',
          justifyContent: 'center',
        }}>
        <View style={{width, flex: 0.5}}>
          <Icon
            name="Comment"
            size={100}
            fill="grey"
            strokeWidth="1"
            style={{alignSelf: 'center'}}
          />
          <Text style={{fontSize: 25, alignSelf: 'center', color: 'grey'}}>
            Not Comment Yet
          </Text>
        </View>
      </View>
    ) : (
      <View
        style={{
          backgroundColor: 'white',
          height: '100%',
        }}>
        <View>
          <ScrollView>
            {selectedPost.comments.map(item => {
              return <Comment key={item.id} item={item} />;
            })}
          </ScrollView>
        </View>
      </View>
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
            return friendList.fallowing.includes(item.id);
          });
          setFriendsData(data);
        });
    }
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: '100%',
        }}>
        <View style={{padding: 5}}>
          <ScrollView>
            {friendsData.map(friend => {
              return <SharePostRow key={friend.id} friend={friend} post={selectedPost} />;
            })}
          </ScrollView>
        </View>
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshLoading(true);
    await getPosts();
    setRefreshLoading(false);
  };

  if (refreshLoading) {
    return <SkeletonPlaceholder />;
  }
  return (
    <View style={styles.mainContainer}>
      {loading ? (
        <SkeletonPlaceholder />
      ) : (
        <View>
          {handleCommentModal && (
            <BottomSheet
              onCloseEnd={() => {
                setHandleCommentModal(false);
              }}
              enabledBottomInitialAnimation={true}
              ref={bs}
              snapPoints={
                selectedPost.comments.length > 5 ? ['80%', 0] : ['55%', 0]
              }
              initialSnap={0}
              callbackNode={fall}
              renderContent={BottomsheetCommentContent}
              renderHeader={BottomSheetDragger}
              enabledGestureInteraction={true}
            />
          )}

          {handleShareModal && (
            <BottomSheet
              onCloseEnd={() => {
                setHandleShareModal(false);
              }}
              enabledBottomInitialAnimation={true}
              ref={bs}
              snapPoints={friendList.length > 5 ? ['80%', 0] : ['55%', 0]}
              initialSnap={0}
              callbackNode={fall}
              renderContent={BottomsheetShareContent}
              renderHeader={BottomSheetDragger}
              enabledGestureInteraction={true}
            />
          )}

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
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {flex: 1},
});

export default HomeScreen;
