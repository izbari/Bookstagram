/**
 * @format
 */
 import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import root from './src/router';
import {name as appName} from './app.json';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler'
AppRegistry.registerComponent(appName, () => gestureHandlerRootHOC(root));
