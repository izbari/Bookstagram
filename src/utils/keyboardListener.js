// import {useState, useEffect, useRef} from 'react';
// import {Keyboard, Animated} from 'react-native';

// export const useKeyboardVisible = () => {
//   const [isKeyboardVisible, setKeyboardVisible] = useState(false);

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//       'keyboardDidShow',
//       () => {
//         setKeyboardVisible(true);
//       },
//     );
//     const keyboardDidHideListener = Keyboard.addListener(
//       'keyboardDidHide',
//       () => {
//         setKeyboardVisible(false);
//       },
//     );

//     return () => {
//       keyboardDidHideListener.remove();
//       keyboardDidShowListener.remove();
//     };
//   }, []);

//   return isKeyboardVisible;
// };
// export const useKeyboardHeight = () => {
//   const keyboardHeight = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const keyboardWillShow = e => {
//       Animated.timing(keyboardHeight, {
//         duration: e.duration,
//         toValue: e.endCoordinates.height,
//         useNativeDriver: true,
//       }).start();
//     };

//     const keyboardWillHide = e => {
//       Animated.timing(keyboardHeight, {
//         duration: e.duration,
//         toValue: 0,
//         useNativeDriver: true,
//       }).start();
//     };

//     const keyboardWillShowSub = Keyboard.addListener(
//       'keyboardWillShow',
//       keyboardWillShow,
//     );
//     const keyboardWillHideSub = Keyboard.addListener(
//       'keyboardWillHide',
//       keyboardWillHide,
//     );

//     return () => {
//       keyboardWillHideSub.remove();
//       keyboardWillShowSub.remove();
//     };
//   }, [keyboardHeight]);

//   return keyboardHeight;
// };

import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

export const useKeyboardHeight = () => {

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    function onKeyboardDidShow(e) { // Remove type here if not using TypeScript
      setKeyboardHeight(e.endCoordinates.height);
    }

    function onKeyboardDidHide() {
      setKeyboardHeight(0);
    }

    const showSubscription = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardHeight;
};