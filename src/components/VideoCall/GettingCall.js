import {StyleSheet, Image, View} from 'react-native';
import React from 'react';
import ActionButton from './Button';
const GettingCall = props => {
  return (
    <View style={styles.container}>
      <Image source={{uri: props.imageUrl ? props.imageUrl : "https://avatars.githubusercontent.com/u/73957984?v=4"}} style={styles.image} />
      <View style={styles.bContainer}>
        <ActionButton
          iconName="phone"
          backgroundColor="green"
          onPress={props.join}
          style={{marginRight: 30}}

        />
        <ActionButton
          iconName="phone"
          backgroundColor="red"
          onPress={props.hangup}
          style={{marginLeft: 30}}
        />
      </View>
    </View>
  );
};

export default GettingCall;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
  image: {position: 'absolute', height: '100%', width: '100%'},
  bContainer: {flexDirection: 'row', bottom: 30},
});
