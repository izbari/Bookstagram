import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AnimatedLottieView from 'lottie-react-native';

export const WelcomeAnimation = () => (
  <AnimatedLottieView
    source={require('../../resources/animations/welcome.json')}
    autoPlay
    loop
  />
);