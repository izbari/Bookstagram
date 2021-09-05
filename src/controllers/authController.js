import {ToastAndroid} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import React from 'react'

exports.createUser = async(email,password) => {
  let check="k";
 await auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
     console.log('created user')
     check= true
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');

      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      console.error(error);
      check=false;
    });
    return check;
};

exports.userLogin =  (props,email,password,data,check=false)=>{
  console.log("check : " , check)
  let check2="k";

if(check){
  auth()
  .signInWithEmailAndPassword(email,password)
  .then(() => {
    console.log("new user login detected!")
    console.log("authdaki update gelen data: ",data);
  database()
  .ref(`/users/${data.path}/`)
  .set(data)
  .then(() => console.log("New user successfully updated")
  );
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
  props.navigation.navigate("Main")
}
else{
  auth()
  .signInWithEmailAndPassword(email,password)
  .then(() => {
    ToastAndroid.showWithGravityAndOffset(
      'Welcome!!',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
    check2=false
    props.navigation.navigate("Main")
    ;
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
}
exports.updateNewUser= (data) => {
  
}
exports.checkAuthConditions = (
  user,
  password,
  passwordAgain,
  terms,
) => {
  console.log(user.name)
  console.log(user.lastname)
  console.log(user.gender)
  console.log((user.name && user.lastName && user.gender))

  if(Boolean(user.name) && Boolean(user.lastname) && Boolean(user.gender)){
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

}else{
  ToastAndroid.showWithGravityAndOffset(
    'Please fill your information',
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    25,
    50,
  );
};
}