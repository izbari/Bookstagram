import {getStatusBarHeight} from 'react-native-status-bar-height';
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const Layout = {
  width: width,
  height: height,
  statusBarHeight: getStatusBarHeight(true),
};
