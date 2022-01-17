import React, {useRef, useState, useEffect} from 'react';

import {
  SafeAreaView,
  View,
  Text,
  Button,
  Animated,
  FlatList,
} from 'react-native';
import slides from '../components/Onboarding/OnboardingItem/onboarding_data';
import OnboardingItem from '../components/Onboarding/OnboardingItem/OnboardingItem';
import NextButton from '../components/Onboarding/NextButton';
import Paginator from '../components/Onboarding/Paginator';

function Onboarding(props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const viewableItemsChanged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;
  const sliderRef = useRef(null);

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      sliderRef.current.scrollToIndex({index: currentIndex + 1});
    } else {
      props.navigation.navigate('HomeScreen');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={slides}
        renderItem={({item}) => <OnboardingItem item={item} />}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],

          {useNativeDriver: false},
        )}
        onViewableItemsChanged={viewableItemsChanged}
        scrollEventThrottle={32}
        viewabilityConfig={viewConfig}
        ref={sliderRef}
      />
      <View style={{flex: 1, justifyContent: 'flex-end', marginBottom: 70}}>
        <View style={{marginBottom: 30}}>
          <Paginator data={slides} scrollX={scrollX} />
        </View>
        <NextButton
          scrollTo={scrollTo}
          percentage={(currentIndex + 1) * (100 / slides.length)}
        />
      </View>
    </SafeAreaView>
  );
}
export default Onboarding;
