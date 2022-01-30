import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {MediaStream,RTCView} from 'react-native-webrtc';

import CustomButton from './Button';

const Video = props => {
  const ButtonContainer = props => {
    return (
      <View style={styles.bContainer}>
        <CustomButton
          iconName="phone"
          backgroundColor="red"
          onPress={props.hangup}
        />
      </View>
    );
  };

  if (props.localStream && !props.remoteStream) {

    return (
      <View style={styles.container}>
        <RTCView
          streamURL={props.localStream.toURL()}
          objectFit={'cover'}
          style={styles.video}
        />
        <ButtonContainer hangup={()=>props.hangup()} />
      </View>
    );
  }
  if (props.localStream && props.remoteStream) {

    return (
      <View style={styles.container}>
        <RTCView
          streamURL={props.remoteStream.toURL()}
          objectFit={'cover'}
          style={styles.video}
        />
         <RTCView
          streamURL={props.localStream.toURL()}
          objectFit={'cover'}
          style={styles.videoLocal}
        />
        <ButtonContainer hangup={props.hangup} />
      </View>
    );
  }
  
  return <ButtonContainer hangup={props.hangup} />
  
};

export default Video;

const styles = StyleSheet.create({
  container: {flex:1,justifyContent:'flex-end',alignItems:'center'},
  bContainer: {flexDirection: 'row', bottom: 30},
  video: {position: 'absolute', height: '100%', width: '100%'},
  videoLocal: {position: 'absolute', height: 150, width: 100,top:0,left:20,elevation:10},
});
