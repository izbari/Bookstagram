import {ToastAndroid} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import React from 'react';

function Toast(msg) {
  ToastAndroid.showWithGravityAndOffset(
    msg,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    25,
    100,
  );
}

exports.createUser = async (user,props) => {
  const condition = checkAuthConditions(user);
  if (condition) {
    auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(authUser => {
        if (auth().currentUser) {
          const userId = auth().currentUser.uid;
          authUser.user.updateProfile({
            displayName: user.name + ' ' + user.lastName,
          });
          console.log("auth user:",authUser,"usernew mi : ",authUser.additionalUserInfo.isNewUser );
          const willSave = {
            email: user.email,
            id: userId,
            name: user.name,
            lastName: user.lastName,
            birth: user.birth,
            gender: user.gender,
            imageUrl: user.imageUrl,
            fallowers: user.fallowers,
            fallowing: user.fallowing,
            books: user.books,
          };
          if (userId) {
            database()
              .ref('users/' + userId)
              .set(willSave);
            props.navigation.navigate('Onboarding',{isNewUser:authUser.additionalUserInfo.isNewUser});
          }
        }
      })
      .catch(function (error) {
        console.log("error:",error);
        return false;
      });
  }
};


exports.userLogin = (props, email, password) => {
  if (password && email) {
    auth()
      .signInWithEmailAndPassword(email, password, props)
      .then(({user}) => { signedIn = 1;
        Toast(`Welcome ${user.displayName} !! `);
        props.navigation.navigate('Main');
       
      })
      .catch(error => {
        if (error.code === 'auth/wrong-password') {
          Toast('Wrong password.');
        }
        if (error.code === 'auth/email-already-in-use') {
          Toast('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          Toast("Email is invalid")
        }
      });
  } else if (!password && !email) Toast('Please enter email and password!');
  else if (!password) Toast('Please enter password!');
  else if (!email) Toast('Please enter email!');

  return signedIn;
};

const checkAuthConditions = ({
  name,
  lastName,
  gender,
  password,
  passwordAgain,
  terms,
}) => {
  if (Boolean(name) && Boolean(lastName) && Boolean(gender)) {
    if (password === passwordAgain) {
      if (gender) {
        if (terms) {
          return true;
        } else {
          Toast('Please Accept terms and policies...');
        }
      } else {
        Toast('Please select your gender!');
      }
    } else {
      Toast('Please enter your password correctly');
    }
  } else {
    Toast('Please fill your information');
  }
  return false;
};
