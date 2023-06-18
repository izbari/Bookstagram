import auth from '@react-native-firebase/auth';
import React from 'react';
import {useLazyGetUserDataByIdQuery} from '../Service/AuthService';
import database from '@react-native-firebase/database';
import {useAppDispatch} from '../Redux/Hooks';
import {setUserData} from '../Redux/Slices/UserSlice';

interface IReturnType {
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const useAuth = (): IReturnType => {
  const dispatch = useAppDispatch();
  const [getUserData, {isLoading}] = useLazyGetUserDataByIdQuery();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    try {
      const subscriber = auth().onAuthStateChanged(authUser => {
        if (authUser) {
          database()
            .ref('users/' + authUser.uid)
            .on('value', snapshot => {
              const user = {
                ...snapshot.val(),
                products: Object.values(snapshot.val().products ?? {}),
              };
              if (user) {
                dispatch(setUserData(user));
                setIsLoggedIn(true);
              } else {
                setIsLoggedIn(false);
              }
            });
          // getUserData(authUser.uid)
          //   .unwrap()
          //   .then(() => {
          //     setIsLoggedIn(true);
          //   });
        }
      });
      return subscriber; // unsubscribe on unmount
    } catch (error) {
      console.warn('useAuth:', error);
    }
  }, [getUserData]);
  return {isLoading, isLoggedIn};
};
