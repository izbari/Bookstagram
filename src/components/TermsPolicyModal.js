import React,{useState,useCallback} from 'react';
import {WebView} from 'react-native-webview';
import {Portal, Modal, Button, View} from 'react-native-paper';
import terms from '../utils/terms';
const TermsPopup = ({visible, hideModal}) => {
  const [bottom, setBottom] = useState(false);
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height;
  };
  const onScroll = useCallback(({nativeEvent}) => {
    if (isCloseToBottom(nativeEvent)) {
      return setBottom(false);
    }
  }, []);

  return (
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={{backgroundColor: 'white', flex: 1, margin: 15}}>
        <View style={{flex: 1, padding: 20}}>
          <WebView
            originWhitelist={['*']}
            onScroll={onScroll}
            scrollEventThrottle={400}
            showsVerticalScrollIndicator={false}
            startInLoadingState={false}
            scalesPageToFit={false}
            source={{
              html: `
                  <head>
                    <meta content="width=width, initial-scale=1, maximum-scale=0.8" name="viewport"></meta>
                  </head>
                  <body style="background-image" size: ${terms}`,
            }}
            style={{flex: 1, padding: 20}}
          />
        </View>
        <Button
          title="Accept Terms and Policies"
          style={{marginTop: 30}}
          onPress={hideModal}
          disabled={bottom}></Button>
      </Modal>
  );
};
export default TermsPopup;
