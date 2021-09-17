import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Button,
  Alert,
  Dimensions,
} from 'react-native';
import PostCard from '../components/Post';
import Image from 'react-native-image-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
const {width} = Dimensions.get('window');

function HomeScreen(props) {
  const [posts, setPosts] = React.useState([]);
  const [deleted, setDeleted] = React.useState(false);

  React.useEffect(() => {
    getPosts();
  }, []);

  React.useEffect(() => {
    getPosts();
    setDeleted(false);
  }, [deleted]);

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
      })
      .catch(err => {
        console.log('ERROR1:', err);
      });
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
          }
        } else {
          console.log('else girmiş');
          deleteFirestoreData(postId);
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
              userName: 'Test name',
              userImg: 'https://randomuser.me/api/portraits/men/41.jpg',
              postTime,
              post,
              postImg,
              liked: false,
              likes,
              comments,
            });
          });

          setPosts(list);
        });
    } catch (error) {
      console.log(error.msg);
    }
  };

  const renderItem = ({item}) => {
    return <PostCard onDelete={handleDelete} item={item} />;
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
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
});

export default HomeScreen;
