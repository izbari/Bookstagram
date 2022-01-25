import * as React from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Alert,
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
import Modal from '../components/Modal/ModalTester';
const {width} = Dimensions.get('window');

function HomeScreen(props) {
  const authuser = useSelector(store => store.user);

  const [commentPosted, setCommentPosted] = React.useState(false);
  const [posts, setPosts] = React.useState([]);
  const [deleted, setDeleted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState({});
  const [user, setUser] = React.useState(authuser);
  React.useEffect(() => {
    console.log('uid', auth()?.currentUser.uid);
    setUser(authuser);
  }, [selectedPost]);

  React.useEffect(async () => {
    getPosts();
  }, [authuser]);

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
    console.log("like post")
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
    console.log("like post")

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
    console.log("deleteFirestoreData")

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
    console.log("on save")

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
    console.log("deletePost")

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
    console.log("handle delete");
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
    console.log("to profile");
    if (auth()?.currentUser.uid === userId) {
      props.navigation.navigate('Profile');
    } else {
      props.navigation.navigate('OtherProfile', {selectedUserId: userId});
    }
  };

  const getPosts = async () => {
    console.log("get posts");
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

  const renderItem = ({item}) => {
    //console.log("rende ritem")
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
          item={item}
          setModalVisible={setModalVisible}
          likeHandler={likeHandler}
          modalVisible={modalVisible}
          setSelectedPost={setSelectedPost}
        />
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
        setCommentPosted(!commentPosted);
      });
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {loading ? (
        <SkeletonPlaceholder />
      ) : (
        <View>
          <Modal
            modalVisible={modalVisible}
            setModalVisible={() => setModalVisible(false)}
            selectedPostComments={selectedPost}
            submitComment={postText => submitComment(postText)}
          />
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {flex: 1},

  lottieContainer: {
    flex: 2,
    width: '85%',
    height: '30%',
    alignSelf: 'center',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonContainer: {flex: 1, margin: 10},
  button: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    width: 290,
    height: 38,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    paddingLeft: 12,
    borderRadius: 10,

    width: 290,
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 10,
    backgroundColor: 'white',
  },
  centeredView: {
    flex: 0.1,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    flex: 0.1,
    width: width,

    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default HomeScreen;
