import React from 'react';

import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Button,
  Flatlist,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
const {width} = Dimensions.get('window');
function OnboardingItem(props) {
  return (
    <View style={{flex: 1, width: width}}>
      <Image
        style={{resizeMode: 'contain', width, height: width}}
        source={{uri: props.item.image}}></Image>
      <Text style={styles.title}>{props.item.title}</Text>
      <Text>{props.item.description}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontWeight: '800',
    fontSize: 28,
    marginBottom: 16,
    color: '#493d8a',
    textAlign: 'center',
  },
  description: {
    fontWeight: '300',

    paddingHorizontal: 64,
    color: '#62656b',
    textAlign: 'center',
  },
  image: {
    flex: 0.7,
    justifyContent: 'center',
  },
});
export default OnboardingItem;
