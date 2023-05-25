import {ToastAndroid} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {IUser} from '../Redux/Slices/UserSlice';

function Toast(msg: string) {
  ToastAndroid.showWithGravityAndOffset(
    msg,
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    25,
    100,
  );
}

export const createUser = async (user: IUser) => {
  console.warn('new user on createUser', user);
  const condition = checkAuthConditions(user);
  console.warn('condition', condition);

  if (condition) {
    auth()
      .createUserWithEmailAndPassword(user?.email, user?.password)
      .then(authUser => {
        console.warn('auth.currentuser', auth().currentUser);
        if (typeof authUser === 'object') {
          const userId = auth().currentUser?.uid;
          console.warn('userId', userId);
          authUser?.user
            .updateProfile({
              displayName: user?.name + ' ' + user?.lastName,
            })
            .then(updateRes => {
              console.warn('updateRes', updateRes);
            });
          const {terms, password, passwordAgain, ...rest} = user;
          const newUser = {
            id: userId,
            ...rest,
          };
          console.log('willsave', newUser);
          if (userId) {
            database()
              .ref('users/' + userId)
              .set(newUser);
          }
        }
      })
      .catch(function (error) {
        console.log(error.message);
        error.code === 'auth/email-already-in-use'
          ? console.warn('This email already used by another account!')
          : null;
        return false;
      });
  }
};

export const userLogin = async (email, password) => {
  if (password && email) {
    return auth()
      .signInWithEmailAndPassword(email, password)
      .then(({user}) => {
        Toast(`Welcome ${user.displayName} !! `);
        console.warn('login user', user);
        return true;
      })
      .catch(error => {
        if (error.code === 'auth/wrong-password') {
          Toast('Wrong password.');
        }
        if (error.code === 'auth/email-already-in-use') {
          Toast('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          Toast('Email is invalid');
        }
        return false;
      });
  } else if (!password && !email) Toast('Please enter email and password!');
  else if (!password) Toast('Please enter password!');
  else if (!email) Toast('Please enter email!');
};

const checkAuthConditions = ({
  name,
  lastName,
  gender,
  password,
  passwordAgain,
  terms,
}) => {
  console.warn('?', name, lastName, gender, password, passwordAgain, terms);
  if (Boolean(name) && Boolean(lastName) && Boolean(gender)) {
    if (password === passwordAgain) {
      if (gender) {
        if (terms) {
          return true;
        } else {
          Toast('Please Accept terms and policies...');
          console.warn('Please Accept terms and policies...');
        }
      } else {
        Toast('Please select your gender!');
        console.warn('Please Accept terms and policies...');
      }
    } else {
      Toast('Please enter your password correctly');
      console.warn('Please Accept terms and policies...');
    }
  } else {
    Toast('Please fill your information');
    console.warn('Please Accept terms and policies...');
  }
  return false;
};

export const checkEmailExist = async email => {
  if (email.length > 0) {
    return await auth()
      .fetchSignInMethodsForEmail(email)
      .then(resp => {
        console.log('Checking email: ' + resp, typeof resp, Object.keys(resp));
        return resp ?? [];
      });
  } else {
    return [];
  }
};
