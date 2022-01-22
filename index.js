/**
 * @format
 */

import {AppRegistry} from 'react-native';
import root from './src/router';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => root);
