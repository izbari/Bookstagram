import * as React from 'react';
import {Provider} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView, StyleSheet} from 'react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {RootStackNavigation} from './src/components/navigation/RootStackNavigation';
import {store} from './src/infrastructure/Redux/Store';

const App: React.FunctionComponent = () => {
  return (
    <GestureHandlerRootView style={style.container}>
      <Provider store={store}>
        <BottomSheetModalProvider>
          <SafeAreaView style={style.container}>
            <RootStackNavigation />
          </SafeAreaView>
        </BottomSheetModalProvider>
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
