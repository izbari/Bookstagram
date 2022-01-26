import * as React from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  View,
  Dimensions,
} from 'react-native';
import database from '@react-native-firebase/database';
import PostBody from '../components/Post/postBody';
import PostFooter from '../components/Post/postFooter';
import PostHeader from '../components/Post/postHeader';

import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import SkeletonPlaceholder from '../components/SkeletonPlaceholder';
import Comment from '../components/Post/postComment/';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import SendCommentTextInput from '../components/Post/sendComment';
const {width, height} = Dimensions.get('window');

function HomeScreen(props) {
  const bs = React.useRef(null);
  const fall = new Animated.Value(1);

  const authuser = useSelector(store => store.user);
  const [posts, setPosts] = React.useState([]);
  const [deleted, setDeleted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState({});
  const [user, setUser] = React.useState(authuser);
  const [showCommentInput, setShowCommentInput] = React.useState(false);
  const [homeIndex, setHomeIndex] = React.useState(0);
  
  React.useEffect(() => {
    //console.log('uid', auth()?.currentUser.uid);
    setUser(authuser);
  }, [authuser]);

  React.useEffect(async () => {
    getPosts();
    console.log(posts);
  }, [user]);

  React.useEffect(async () => {
    getPosts();
    setDeleted(false);
  }, [deleted]);

  const likeHandler = (postId, prevLikes) => {
    const selectedPost = posts.find(post => post.id === postId);
    console.log('selectedPost cevabi:', selectedPost);
    //unlike
    if (selectedPost.likes.includes(auth()?.currentUser.uid)) {
      unlikePost(postId, prevLikes);
    }
    //like
    else likePost(postId, prevLikes);
  };

  const likePost = (postId, prevLikes) => {
    console.log('like post');
    firestore()
      .collection('posts')
      .doc(postId)
      .update({
        likes: [...prevLikes, auth()?.currentUser.uid],
      })
      .then(() => {
        console.log('Likes count updated!');
      });
  };
  const unlikePost = (postId, prevLikes) => {
    console.log('like post');

    console.log(
      'filter cevabı:',
      prevLikes.filter(element => element != auth()?.currentUser.uid),
    );
    firestore()
      .collection('posts')
      .doc(postId)
      .update({
        likes: prevLikes.filter(element => element != auth()?.currentUser.uid),
      })
      .then(() => {
        console.log('Likes count updated!');
      });
  };
  const deleteFirestoreData = postId => {
    console.log('deleteFirestoreData');

    firestore()
      .collection('posts')
      .doc(postId)
      .delete()
      .then(() => {
        Alert.alert(
          'Post Deleted !',
          'Your Post Has Been Deleted Successfully',
        );
        setDeleted(true);
      })
      .catch(err => {
        console.log('ERROR1:', err);
      });
  };

  const onSave = postId => {
    console.log('on save');

    let added = [];
    console.log('added ilk init', added);

    if (user?.saved) {
      added = user.saved;
      added.includes(postId)
        ? (added = added.filter(element => postId != element))
        : added.push(postId);
    } else {
      added.push(postId);
    }

    database()
      .ref(`/users/${auth()?.currentUser?.uid}/saved`)
      .set(added)
      .then(() => console.log('Data set.'));
  };

  const deletePost = postId => {
    console.log('deletePost');

    console.log('Current Post Id:', postId);
    firestore()
      .collection('posts')
      .doc(postId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('data:', documentSnapshot.data());
          const {postImg} = documentSnapshot.data();
          if (postImg != null) {
            console.log('postimg null değil linki bu :', postImg);
            const storageRef = storage().refFromURL(postImg);
            const imageRef = storage().ref(storageRef.fullPath);
            console.log('imageRef:', imageRef);
            imageRef
              .delete()
              .then(() => {
                console.log(`${postImg} has been deleted`);
                deleteFirestoreData(postId);
                setDeleted(true);
              })
              .catch(err => {
                console.log('Error while  deleting the image... ', err);
              });
          } else {
            console.log('else girmiş');
            deleteFirestoreData(postId);
          }
        }

        console.log('post deleted!');
      })
      .catch(err => {
        console.log('ERROR2:', err);
      });
  };

  const handleDelete = postId => {
    console.log('handle delete');
    Alert.alert('Delete Post', 'Are You Sure ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Confirm', onPress: () => deletePost(postId)},
    ]);
  };
  const toProfile = userId => {
    console.log('to profile');
    if (auth()?.currentUser.uid === userId) {
      props.navigation.navigate('Profile');
    } else {
      props.navigation.navigate('OtherProfile', {selectedUserId: userId});
    }
  };

  const getPosts = async () => {
    try {
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

          if (loading) {
            setLoading(false);
          }
        });
    } catch (error) {
      console.log(error.msg);
    }
  };

  const renderItem = ({item,index}) => {
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
        <PostHeader
          item={item}
          toProfile={userId => toProfile(userId)}
          onDelete={handleDelete}
          onSave={onSave}
        />
        <PostBody item={item} />
        <PostFooter
          setShowCommentInput={setShowCommentInput}
          item={item}
          index={index}
          setHomeIndex={setHomeIndex}
          setModalVisible={setModalVisible}
          likeHandler={likeHandler}
          modalVisible={modalVisible}
          setSelectedPost={setSelectedPost}
        />
        {showCommentInput && (index == homeIndex) ? <SendCommentTextInput submitComment={submitComment}/>: null}
      </View>
    );
  };
  const submitComment = postText => {
    console.log('calisiyo mu makes', postText);
    console.log('selected post : ', selectedPost);

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
        <Icon name="drag-horizontal-variant" size={35} color="#909090" />
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

  return (
    <View style={styles.mainContainer}>
      {loading ? (
        <SkeletonPlaceholder />
      ) : (
        <View>
          {modalVisible ? (
            <BottomSheet
              onCloseEnd={() => {
                console.log('değistirdim');
                console.log(selectedPost);
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
