import React from 'react';
import LottieView from 'lottie-react-native';
 
function login(){
    return <LottieView  source = {require('../../assets/login.json')} autoPlay loop/>
}
export default login;