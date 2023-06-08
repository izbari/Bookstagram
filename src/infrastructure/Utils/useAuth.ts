import auth from '@react-native-firebase/auth';
import React from 'react';
import {useLazyGetUserDataByIdQuery} from '../Service/AuthService';

interface IReturnType {
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const useAuth = (): IReturnType => {
  const [getUserData, {isLoading}] = useLazyGetUserDataByIdQuery();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    try {
      const subscriber = auth().onAuthStateChanged(authUser => {
        if (authUser) {
          getUserData(authUser.uid)
            .unwrap()
            .then(() => {
              setIsLoggedIn(true);
            });
        } else {
          setIsLoggedIn(false);
        }
      });
      return subscriber; // unsubscribe on unmount
    } catch (error) {
      console.warn('useAuth:', error);
    }
  }, [getUserData]);
  return {isLoading, isLoggedIn};
};
