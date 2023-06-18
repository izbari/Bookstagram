import * as React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {RouteNames} from '../../components/navigation/RouteNames';
import {IWithNavigation} from '../../components/navigation/Types';
import {LandingPage} from '../../components/Landing/LandingPage';
import {Colors} from '../../resources/constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
type ILandingProps = IWithNavigation<RouteNames.landingMain>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightPurple,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
});
export const Landing: React.FunctionComponent<ILandingProps> = props => {
  const authUser = useAppSelector(store => store.user.user);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation?.openDrawer()}>
          <FastImage source={{uri: authUser?.imageUrl}} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.title}>Bookstagram</Text>
        <TouchableOpacity
          onPress={() => props.navigation.navigate(RouteNames.chat)}>
          <Ionicons name="chatbox-ellipses-outline" size={25} color="white" />
        </TouchableOpacity>
      </View>
      <LandingPage navigation={props.navigation} />
    </View>
  );
};
