import React from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

exports.likeHandler = selectedPost => {
  const uid = auth()?.currentUser.uid;
  //unlike
  if (selectedPost.likes.includes(uid)) {
    unlikePost(selectedPost.id, selectedPost.likes, uid);
  }
  //like
  else likePost(selectedPost.id, selectedPost.likes, uid);
};

const unlikePost = (postId, prevLikes, uid) => {
 
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

const likePost = (postId, prevLikes, uid) => {
  
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
