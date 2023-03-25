import React from 'react';
import {View} from 'react-native';
import LottieView from 'lottie-react-native';
function loading(props) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <LottieView
        source={require('../../assets/loading.json')}
        autoPlay
        loop
        autoSize
      />
    </View>
  );
}
export default loading;
