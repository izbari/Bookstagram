import {ToastAndroid} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import React from 'react';
import {cleanSingle} from 'react-native-image-crop-picker';

exports.createUser = async ({
  email,
  password,
  name,
  lastName,
  birth,
  gender,
  fallowers,
  fallowing,
  imageUrl,
  books,
}) => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => {
      if (auth().currentUser) {

        const userId = auth().currentUser.uid;

        if (userId) {

          database()
            .ref('users/' + userId)
            .set({
              email,
              id: userId,
              name,
              lastName,
              birth,
              gender,
              imageUrl,
              fallowers,
              fallowing,
              books,
            });

            return true;
        }
      }
    })
    .catch(function (error) {

      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log('Register!');
      console.log('ERROR:', errorCode, 'MSG:', errorMessage);
      return false;
    });
};

exports.userLogin = (props, email, password, data, check = false) => {
  console.log('check : ', check);
  let check2 = 'k';

  if (check) {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
    console.log("******************NEW USER DETECTED******************")
    props.navigation.navigate("Onboarding")
        console.log('authdaki update gelen data: ', data);
       
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
   
  } else {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        ToastAndroid.showWithGravityAndOffset(
          'Welcome!!',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
        check2 = false;
        props.navigation.navigate('Main');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  }
  return check2;
};

exports.checkAuthConditions = (user, password, passwordAgain, terms) => {
  console.log(user.name);
  console.log(user.lastname);
  console.log(user.gender);
 

  if (Boolean(user.name) && Boolean(user.lastname) && Boolean(user.gender)) {
    if (password === passwordAgain) {
      if (user.gender) {
        if (terms) {
          ToastAndroid.showWithGravityAndOffset(
            'User created successfully !',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
          return true;
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'Please Accept terms and policies...',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
      } else {
        ToastAndroid.showWithGravityAndOffset(
          'Please select your gender!',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'Please enter your password correctly',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  } else {
    ToastAndroid.showWithGravityAndOffset(
      'Please fill your information',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }
};
