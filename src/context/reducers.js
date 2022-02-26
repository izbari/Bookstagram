import {ToastAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

export default function (state, action, props) {
  function Toast(message) {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }
  const deletePostById = id => {
    firestore()
      .collection('posts')
      .doc(id)
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

  const likePostById = post => {
    var {id, likes} = post;
    firestore()
      .collection('posts')
      .doc(id)
      .update({
        likes: [...likes, auth()?.currentUser.uid],
      })
      .then(() => {
        console.log('Post liked !!');
      });
    var newList = [
      ...state.posts,
      {
        ...post,
        likes: [...likes, auth()?.currentUser.uid],
      },
    ];
    return {...state, posts: newList};
  };
  const unlikePostByID = post => {
    var {id, likes} = post;
    var updatedLikes = likes.filter(
      element => element != auth()?.currentUser.uid,
    );
    var newList = [
      ...state.posts,
      {
        ...post,
        likes: updatedLikes,
      },
    ];
    firestore()
      .collection('posts')
      .doc(id)
      .update({
        likes: updatedLikes,
      })
      .then(() => {
        console.log('Post unliked !!');
      });
    return {...state, posts: newList};
  };

  switch (action.type) {
  case 'MESSAGE_NOTIFICATION':
    var {messageId} = action.payload;
    if(state.messageBadge.includes(messageId)) return {...state};
    else return {...state, messageBadge: [...state.messageBadge, messageId]};
    case 'POST_LIST':
      var posts = action.payload.posts;
      return {...state, posts: posts};
    case 'SAVE_POST':
      var postId = action.payload.itemId;
      var userRef = `/users/${auth()?.currentUser?.uid}/saved`;

      database()
        .ref(userRef)
        .once('value')
        .then(snapshot => {
          if (snapshot.val()) {
            snapshot.val().includes(postId)
              ? Toast('Post Already Saved')
              : database()
                  .ref(userRef)
                  .set([...snapshot.val(), postId])
                  .then(() => console.log('Post added your saved list.'));
          } else {
            database()
              .ref(userRef)
              .set([postId])
              .then(() => console.log('Post added your saved list.'));
          }
        });

      return {...state};
    case 'DELETE_POST':
      var id = action.payload.postId;
      var newList = state.posts.filter(post => post.id !== id);
      firestore()
        .collection('posts')
        .doc(id)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            const {postImg} = documentSnapshot.data();
            if (postImg != null) {
              const storageRef = storage().refFromURL(postImg);
              const imageRef = storage().ref(storageRef.fullPath);
              imageRef
                .delete()
                .then(() => {
                  deletePostById(id);
                })
                .catch(err => {
                  console.log('Error while  deleting the image... ', err);
                });
            } else {
              console.log('Post without image deleted...');
              deletePostById(id);
            }
          }
        })
        .catch(err => {
          console.log('ERROR2:', err);
        });
      return {...state, posts: newList};

    case 'LIKE_HANDLER':
      var post = action.payload.post;
      //unlike
      if (post.likes.includes(auth()?.currentUser.uid)) {
        return unlikePostByID(post);
      }
      //like
      else {
        return likePostById(post);
      }
    case 'ADD_COMMENT':
      var {postText, user, item} = action.payload;
      var comments = [
        ...item.comments,
        {
          userId: auth()?.currentUser?.uid,
          id: new Date().getTime().toString(),
          img: user.imageUrl,
          name: user.name + ' ' + user.lastName,
          comment: postText,
          postTime: firestore.Timestamp.fromDate(new Date()),
        },
      ];

      var newList = [...state.posts, {...item, comments: comments}];
      firestore()
        .collection('posts')
        .doc(item.id)
        .update({
          comments: comments,
        })
        .then(() => {
          Toast('Comment successfully posted!');
        });

      return {...state, posts: newList};
 

    case 'SET_ROUTE_NAME':
      console.log('reducer calisti dispacta gelen', action.payload.routeName);
      return {...state, routeName: action.payload.routeName};

    case 'SET_LANG':
      return {...state, lang: action.payload.lang};

    case 'SET_USER':
      return {...state, user: action.payload.user};

    case 'ADD_FAVORITE':
      if (state.favList.some(item => action.payload.favCard.id === item.id)) {
        Toast('You already added this book your wishlist...');
        return state;
      } else {
        Toast('This book add your wishlist successfully');
        const newList = [...state.favList, action.payload.favCard];
        return {...state, favList: newList};
      }

    case 'ADD_CART':
      if (state.cartList.some(item => item.id === action.payload.cartCard.id)) {
        Toast('This book Already added your cart...');
        return state;
      } else {
        Toast('This book add your cart successfully');
        const newCardList = [...state.cartList, action.payload.cartCard];
        return {...state, cartList: newCardList};
      }

    case 'ADD_TOPIC':
      return {...state, topicIds: action.payload.topicList};

    case 'REMOVE_FAVORITE':
      const newList2 = state.favList.filter(item => {
        return item.id !== action.payload.rmFavBook.id;
      });
      return {...state, favList: newList2};

    case 'REMOVE_CART':
      console.log(action.payload.rmCartBook);
      const newList3 = state.cartList.filter(item => {
        return item.id !== action.payload.rmCartBook.id;
      });
      return {...state, cartList: newList3};

    default:
      return state;
  }
}
