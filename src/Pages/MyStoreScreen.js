import {StyleSheet, Text, View, Image} from 'react-native';

import React from 'react';
import colors from '../constants/colors';

export default function MyStoreScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <Image
          source={require('../assets/png/imagePlaceholder.jpg')}
          style={styles.profileImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.username}>meliketekin</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
    backgroundColor:'white'
  },
  background: {
    width: '100%',
    height: 150,
    backgroundColor: colors.lightPurple,
  },
  profileImage: {
    position: 'absolute',
    top: 100,
    left: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },
  username: {
    position:'absolute',
    top:205,
    left:20,
    width:100,
    fontSize:17,
    fontWeight:'500'
  }
});
