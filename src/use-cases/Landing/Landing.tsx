import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {RouteNames} from '../../components/navigation/RouteNames';
import {IWithNavigation} from '../../components/navigation/Types';
import {LandingPage} from '../../components/Landing/LandingPage';

type ILandingProps = IWithNavigation<RouteNames.landingMain>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export const Landing: React.FunctionComponent<ILandingProps> = props => {
  return (
    <View style={styles.container}>
      <LandingPage navigation={props.navigation} />
    </View>
  );
};
