import React from 'react';
import LottieView from 'lottie-react-native';
function loading(props) {
  return (
    <LottieView source={require('../../assets/loading.json')} autoPlay loop autoSize/>
  );
}
export default loading;
