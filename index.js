/**
 * @format
 */
import './src/utils/Languages/IMLocalize';
import 'react-native-gesture-handler';
import {AppRegistry, LogBox} from 'react-native';
import root from './src/navigation';
import {name as appName} from './app.json';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import RNBootSplash from 'react-native-bootsplash';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);
database().setPersistenceEnabled(true);
firestore().settings({
  persistence: true, // disable offline persistence
});

RNBootSplash.hide({fade: true}); // fade
// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(root));
