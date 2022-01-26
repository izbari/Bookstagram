import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import Comment from '../Post/postComment';
const {width} = Dimensions.get("window")
const ModalTester = ({navigation,route}) => {
   const bs = React.useRef();
    const fall = new Animated.Value(1);
  
  
  const arr = [
    'zafer',
    'zafer',
    'zafer',
    'zafer',
    'zafer',
    'zafer',
    'zafer',
    'zafer',
    'zafer',
    'zafer',
    'zafer',
    'zafer',
  ];

  const renderHeader = () => (
    <View style={{padding: 20, backgroundColor: 'yellow'}}>
      <Text>Hello</Text>
    </View>
  );

  const renderInner = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <ScrollView style={styles.panelHandle}>
          {arr.map(item => (
            <Comment item={item} />
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <BottomSheet
        ref={bs}
        snapPoints={[330, 0]}
        initialSnap={0}
        callbackNode={fall}
        renderContent={renderInner}
        renderHeader={renderHeader}
        enabledGestureInteraction={true}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {flex: 1},
  panelHandle: {
    width: width,
    height: 500,
    borderRadius: 4,
    backgroundColor: 'grey',
    marginBottom: 10,
  },
  panelHeader: {alignItems: 'center', backgroundColor: 'red'},
});
export default ModalTester;
