import * as React from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  Dimensions,
  RefreshControl,
} from 'react-native';
import PostBody from '../components/Post/postBody';
import PostFooter from '../components/Post/postFooter';
import PostHeader from '../components/Post/postHeader';
import FastImage from 'react-native-fast-image';
import {useSelector, useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import SkeletonPlaceholder from '../components/SkeletonPlaceholder';
import Comment from '../components/Post/postComment/';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from '../components/Icons';
import database from '@react-native-firebase/database';
import firebaseUtil from '../utils/parseFirebaseData';
import {Button} from 'react-native-paper';

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
    console.log('---------------------------');
    await getPosts();
    dispatch({type: 'POST_LIST', payload: {posts: posts}});
  }, []);

  //need to rerender when  post actions happend (like, comment, delete)
  React.useEffect(async () => {
    // when post actions happend this line will be execute and fetch modified posts
    if (posts.length != 0 && POST_LIST.length != 0 && POST_LIST !== posts) {
      console.log('ÇALIŞTI**');
      await getPosts();
    } else {
      console.log('Posts and POST_LIST are same');
    }
  }, [POST_LIST]);

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
              return (
                <View
                  key={friend.id}
                  style={{
                    flexDirection: 'row',
                    padding: 5,
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: 10,
                    shadowColor: '#CBCBCB',
                  }}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      <FastImage
                        style={{
                          height: 40,
                          width: 40,
                          borderRadius: 50,
                          overflow: 'hidden',
                          elavation: 5,
                        }}
                        source={{
                          uri: friend.imageUrl,
                          priority: FastImage.priority.high,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                      <View
                        style={{
                          justifyContent: 'center',
                          marginLeft: 10,
                          padding: 5,
                        }}>
                        <Text style={{fontWeight: 'bold'}}>
                          {friend.name + ' ' + friend.lastName}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Text
                            numberOfLines={2}
                            style={{
                              fontStyle: 'italic',
                              fontSize: 12,
                              color: 'grey',
                              marginTop: 5,
                            }}>
                            {'Cool bio ...'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Button
                      mode="contained"
                      
                      style={{alignSelf: 'center',backgroundColor:'#2596ff'}}
                      labelStyle={{fontSize: 12, color: 'white',fontWeight:'bold'}}
                      onPress={() => console.log('Pressed')}>
                      Send
                    </Button>
                  </View>
                </View>
              );
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
