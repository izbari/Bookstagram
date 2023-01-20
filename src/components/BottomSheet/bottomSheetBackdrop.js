import React, {useMemo} from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

const CustomBackdrop = ({animatedIndex, style}) => {
  // animated variables
  console.log(animatedIndex)
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 1],
      Extrapolate.EXTEND,
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: '#000',
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle],
  );

  return <Animated.View style={containerStyle} />;
};

export default CustomBackdrop;
