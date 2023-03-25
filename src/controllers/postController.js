import React from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export const getPosts = async () => {
  try {
    const list = [];
    return await firestore()
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
        return list;
      });
  } catch (error) {
    setLoading(false);
    setError(true);
    console.log('ERROR:', error.msg);
  }
};

export const likeHandler = selectedPost => {
  const uid = auth()?.currentUser.uid;
  //unlike
  if (selectedPost.likes.includes(uid)) {
    unlikePost(selectedPost.id, selectedPost.likes, uid);
  }
  //like
  else likePost(selectedPost.id, selectedPost.likes, uid);
};

export const unlikePost = (postId, prevLikes, uid) => {
  firestore.
  firestore()
    .collection('posts')
    .doc(postId)
    .update({
      likes: prevLikes.filter(element => element != uid),
    })
    .then(() => {
      //setRerender(!rerender);
      console.log('Post unliked!');
    });
};

export const likePost = (postId, prevLikes, uid) => {
  firestore()
    .collection('posts')
    .doc(postId)
    .update({
      likes: [...prevLikes, uid],
    })
    .then(() => {
      //setRerender(!rerender);
      console.log('Post liked');
    });
};
