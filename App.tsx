import * as React from 'react';
import {Provider} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {RootStackNavigation} from './src/components/navigation/RootStackNavigation';
import {store} from './src/infrastructure/Redux/Store';
import {MenuProvider} from 'react-native-popup-menu';
import {CustomStatusBar} from './src/components/Common/StatusBar';
import {Colors} from './src/resources/constants/Colors';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import 'react-native-gesture-handler';

const App: React.FunctionComponent = () => {
  return (
    <GestureHandlerRootView style={style.container}>
      <Provider store={store}>
        <MenuProvider>
          <BottomSheetModalProvider>
            <SafeAreaProvider>
              <CustomStatusBar
                backgroundColor={Colors.lightPurple}
                barStyle="light-content"
              />
              <RootStackNavigation />
            </SafeAreaProvider>
          </BottomSheetModalProvider>
        </MenuProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
