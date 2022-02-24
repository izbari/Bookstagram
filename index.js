/**
 * @format
 */
 import './src/utils/Languages/IMLocalize'
 import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import root from './src/router';
import {name as appName} from './app.json';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
import messaging from '@react-native-firebase/messaging';


// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(root));


