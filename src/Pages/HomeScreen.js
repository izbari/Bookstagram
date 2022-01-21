import * as React from 'react';
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  ScrollView,
  Alert,
  View,
  Dimensions,
} from 'react-native';
import database from '@react-native-firebase/database';
import PostCard from '../components/Post';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

import Modal from '../components/Modal/ModalTester';
import {useDispatch, useSelector} from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const {width} = Dimensions.get('window');

function HomeScreen(props) {
  const [commentPosted, setCommentPosted] = React.useState(false);
  const [posts, setPosts] = React.useState([]);
  const [deleted, setDeleted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState({});
  const [threeDotVisible, setThreeDotVisible] = React.useState(false);
  const [user, setUser] = React.useState({});

  const dispatch = useDispatch();
 
  React.useEffect(() => {
    if (auth()?.currentUser.uid || props.route.params?.authId) {
      database()
        .ref(`/users/${auth().currentUser.uid || props.route.params.authId}`)
        .on('value', snapshot => {
          dispatch({type: 'SET_USER', payload: {user: snapshot.val()}});
          console.log(
            'route user states changed and fetched informations again...',
          );
        }).then(() => setUser(useSelector(store => store.user)));
    }
  }, []);

  React.useEffect(async () => {
    getPosts();
  }, [posts, submitComment, likePost, commentPosted, setCommentPosted]);

  React.useEffect(async () => {
    getPosts();
    setDeleted(false);
  }, [deleted]);

  const likeHandler = (postId, prevLikes) => {
    const selectedPost = posts.find(post => post.id === postId);
    console.log('selectedPost cevabi:', selectedPost);
    //unlike
    if (selectedPost.likes.includes(auth().currentUser.uid)) {
      unlikePost(postId, prevLikes);
    }
    //like
    else likePost(postId, prevLikes);
  };

  const likePost = (postId, prevLikes) => {
    firestore()
      .collection('posts')
      .doc(postId)
      .update({
        likes: [...prevLikes, auth().currentUser.uid],
      })
      .then(() => {
        console.log('Likes count updated!');
      });
  };
  const unlikePost = (postId, prevLikes) => {
    console.log(
      'filter cevabı:',
      prevLikes.filter(element => element != auth().currentUser.uid),
    );
    firestore()
      .collection('posts')
      .doc(postId)
      .update({
        likes: prevLikes.filter(element => element != auth().currentUser.uid),
      })
      .then(() => {
        console.log('Likes count updated!');
      });
  };
  const deleteFirestoreData = postId => {
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
    if (auth().currentUser.uid === userId) {
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

  const onThreeDotClicked = params => {
    setThreeDotVisible(!threeDotVisible);
    console.warn('calistim');
  };

  const renderItem = ({item}) => {
    return (
      <PostCard
        toProfile={userId => toProfile(userId)}
        onDelete={handleDelete}
        onSave={onSave}
        likeHandler={likeHandler}
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        setSelectedPost={setSelectedPost}
        onThreeDotClicked={onThreeDotClicked}
        item={item}
      />
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
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{alignItems: 'center'}}>
          <SkeletonPlaceholder>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                marginLeft: 5,
              }}>
              <View
                style={{
                  height: 60,
                  width: 60,

                  borderRadius: 50,
                }}
              />
              <View style={{marginLeft: 20}}>
                <View style={{width: 120, height: 20, borderRadius: 4}} />
                <View
                  style={{marginTop: 6, width: 80, height: 15, borderRadius: 4}}
                />
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                borderRadius: 4,
                width: 300,
                height: 20,
              }}
            />
            <View
              style={{
                marginTop: 6,
                width: 250,
                height: 20,
                borderRadius: 4,
              }}
            />
            <View
              style={{
                marginTop: 6,
                width: 350,
                height: 200,
                marginTop: 10,
                borderRadius: 4,
              }}
            />
          </SkeletonPlaceholder>
          <SkeletonPlaceholder>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                marginLeft: 5,
              }}>
              <View
                style={{
                  height: 60,
                  width: 60,

                  borderRadius: 50,
                }}
              />
              <View style={{marginLeft: 20}}>
                <View style={{width: 120, height: 20, borderRadius: 4}} />
                <View
                  style={{marginTop: 6, width: 80, height: 15, borderRadius: 4}}
                />
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                borderRadius: 4,
                width: 300,
                height: 20,
              }}
            />
            <View
              style={{
                marginTop: 6,
                width: 250,
                height: 20,
                borderRadius: 4,
              }}
            />
            <View
              style={{
                marginTop: 6,
                width: 350,
                height: 200,
                marginTop: 10,
                borderRadius: 4,
              }}
            />
          </SkeletonPlaceholder>
          <SkeletonPlaceholder>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                marginLeft: 5,
              }}>
              <View
                style={{
                  height: 60,
                  width: 60,

                  borderRadius: 50,
                }}
              />
              <View style={{marginLeft: 20}}>
                <View
                  style={{
                    width: 120,
                    height: 20,
                    borderRadius: 4,
                    marginTop: 20,
                  }}
                />
                <View
                  style={{marginTop: 6, width: 80, height: 15, borderRadius: 4}}
                />
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                borderRadius: 4,
                width: 300,
                height: 20,
              }}
            />
            <View
              style={{
                marginTop: 6,
                width: 250,
                height: 20,
                borderRadius: 4,
              }}
            />
            <View
              style={{
                marginTop: 6,
                width: 350,
                height: 200,
                marginTop: 10,
                borderRadius: 4,
              }}
            />
          </SkeletonPlaceholder>
        </ScrollView>
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
