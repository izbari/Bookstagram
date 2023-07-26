import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, Animated} from 'react-native';

export const ProgressBar = ({
  height,
  borderColor,
  borderWidth,
  borderRadius,
  barColor,
  fillColor,
  row,
  progress,
  duration,
}) => {
  const animation = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: progress,
      duration: 2000,
    }).start();
  }, [animation, duration, progress]);

  const widthInterpolated = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={[{flexDirection: 'row', height}, row ? {flex: 1} : undefined]}>
      <View style={{flex: 1, borderColor, borderWidth, borderRadius}}>
        <View style={[StyleSheet.absoluteFill, {backgroundColor: fillColor}]} />
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: widthInterpolated,
            backgroundColor: barColor,
          }}
        />
      </View>
    </View>
  );
};
