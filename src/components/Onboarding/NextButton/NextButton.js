import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function NextButton(props) {
  const size = 128;
  const strokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const progressAnimation = React.useRef(new Animated.Value(0)).current;
  const progressRef = React.useRef(null);

  const animation = toValue => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };
  React.useEffect(() => {
    animation(props.percentage);
    console.log(props.percentage);
  }, [props.percentage]);

  React.useEffect(() => {
    progressAnimation.addListener(
      value => {
        const strokeDashoffset =
          circumference - (circumference * value.value) / 100;

        if (progressRef?.current) {
          progressRef.current.setNativeProps({strokeDashoffset});
        }
      },
      [props.percentage],
    );
    return () => {
      progressAnimation.removeAllListeners();
    };
  }, [props.percentage]);

  return (
    <View style={styles.constainer}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={center}>
          <Circle
            stroke={'#E6E7E8'}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            ref={progressRef}
            stroke={'#F4338F'}
            cx={center}
            cy={center}
            r={radius}
            strokeDasharray={circumference}
            strokeWidth={strokeWidth}></Circle>
        </G>
      </Svg>

      <TouchableOpacity
        onPress={props.scrollTo}
        style={styles.button}
        activeOpacity={0.6}>
        <AntDesign name="arrowright" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  constainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  button: {
    position: 'absolute',
    backgroundColor: '#f4338f',
    borderRadius: 100,
    padding: 20,
  },
});
export default NextButton;
