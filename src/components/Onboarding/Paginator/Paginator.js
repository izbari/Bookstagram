import React from 'react';
import {View, StyleSheet, Animated, useWindowDimensions} from 'react-native';

function Paginator(props) {
  console.log(props.data.length);
  const {width} = useWindowDimensions();
  return (
    <View style={{flexDirection: 'row', height: 64,alignSelf:'center'}}>
      {props.data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = props.scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: 'clamp',
        });
        const opacity = props.scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            style={[styles.dot, {width: dotWidth, opacity}]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'black',
    marginHorizontal: 8,
  },
});
export default Paginator;
