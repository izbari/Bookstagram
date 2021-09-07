import React from 'react';
import LottieView from 'lottie-react-native';

function loading(){

   return <LottieView source = {require('../../assets/loading.json')} autoPlay loop/>
}
export default loading;