import * as React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Dimensions,
  RefreshControl,
} from 'react-native';
import PostBody from '../components/Post/postBody';
import PostFooter from '../components/Post/postFooter';
import PostHeader from '../components/Post/postHeader';

import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import SkeletonPlaceholder from '../components/SkeletonPlaceholder';
import Comment from '../components/Post/postComment/';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from '../components/Icons';

import SendCommentTextInput from '../components/Post/sendComment';
const {width} = Dimensions.get('window');

function HomeScreen({navigation, route}) {
  const newPost = route?.params?.newPost;
  const dispatch = useDispatch();
  const bs = React.useRef(null);
  const fall = new Animated.Value(1);
  const authuser = useSelector(store => store.user);
  const [posts, setPosts] = React.useState([]);

  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState({});
  const [user, setUser] = React.useState(authuser);
  const [showCommentInput, setShowCommentInput] = React.useState(false);
  const [homeIndex, setHomeIndex] = React.useState(0);
  const [refreshLoading, setRefreshLoading] = React.useState(false);

  const POST_LIST = useSelector(store => store.posts);

  React.useEffect(() => {
    setUser(authuser);
  }, [authuser]);

  React.useEffect(async () => {
    console.log('---------------------------');
    await getPosts();
    dispatch({type: 'POST_LIST', payload: {posts: posts}});
  }, []);

  const ModalHandle = React.useCallback(() => {
    setModalVisible(value => !value);
  }, [setModalVisible]);

  const selectedPostHandle = React.useCallback((post) => {
    setSelectedPost(post);
  }, [setSelectedPost]);
  console.log('RERENDER CHECKER');
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
            const {likes, comments, post, postImg, postTime, userId} =
              doc.data();
            list.push({
              id: doc.id,
              userId,
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
          return list
        });
    } catch (error) {
      setLoading(false);
      setError(true);
      console.log(error.msg);
    }
  };

  const renderItem = ({item, index}) => {
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
          setShowCommentInput={setShowCommentInput}
          item={item}
          index={index}
          setHomeIndex={setHomeIndex}
          setModalVisible={ModalHandle}
          setSelectedPost={selectedPostHandle}
        />
        {showCommentInput && index == homeIndex ? (
          <SendCommentTextInput submitComment={submitComment} />
        ) : null}
      </View>
    );
  };
  const submitComment = postText => {
    firestore()
      .collection('posts')
      .doc(selectedPost.id)
      .update({
        comments: [
          ...selectedPost.comments,
          {
            userId: auth()?.currentUser?.uid,
            id: new Date().getTime().toString(),
            img: user.imageUrl,
            name: user.name + ' ' + user.lastName,
            comment: postText,
            postTime: firestore.Timestamp.fromDate(new Date()),
          },
        ],
      })
      .then(() => {
        console.log('Comment successfully posted!');
        setShowCommentInput(false);
      });
  };

  const renderHeader = () => {
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

  const renderInner = () => (
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
          {modalVisible ? (
            <BottomSheet
              onCloseEnd={() => {
                setModalVisible(false);
              }}
              enabledBottomInitialAnimation={true}
              ref={bs}
              snapPoints={[500, 0]}
              initialSnap={0}
              callbackNode={fall}
              renderContent={renderInner}
              renderHeader={renderHeader}
              enabledGestureInteraction={true}
            />
          ) : null}
          <FlatList
            data={posts}
            renderItem={renderItem}
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
