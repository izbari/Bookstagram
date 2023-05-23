import auth from '@react-native-firebase/auth';
import React from 'react';

interface IReturnType {
  isLoggedIn: boolean;
  isLoading: boolean;
}

export const useAuth = (): IReturnType => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    try {
      const subscriber = auth().onAuthStateChanged(authUser => {
        if (authUser) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      });
      return subscriber; // unsubscribe on unmount
    } finally {
      setIsLoading(false);
    }
  }, []);
  return {isLoading, isLoggedIn};
};
