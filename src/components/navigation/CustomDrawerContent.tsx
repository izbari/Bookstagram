import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {useAppDispatch, useAppSelector} from '../../infrastructure/Redux/Hooks';
import tw from 'twrnc';
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RouteNames} from './RouteNames';
import {setCurrentTab} from '../../infrastructure/Redux/Slices/UserSlice';
export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const {isInBookTab, user} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  return (
    <DrawerContentScrollView {...props}>
      <View style={tw`flex-row  justify-between mr-4`}>
        <View>
          <FastImage
            style={tw`w-12 h-12 rounded-full mt-5 mx-4 mb-2`}
            source={{
              uri: user?.imageUrl,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Text style={tw`text-base font-semibold mx-4`}>
            {user?.name + ' ' + user?.lastName}
          </Text>
        </View>
        <TouchableOpacity
          style={tw`items-center`}
          onPress={() => {
            props.navigation.closeDrawer();
            dispatch(setCurrentTab(!isInBookTab));
            props.navigation.navigate(
              isInBookTab ? RouteNames.landing : RouteNames.discoverBook,
            );
          }}>
          <Ionicons
            name={isInBookTab ? 'book-outline' : 'people-outline'}
            size={30}
            style={tw`mx-4`}
          />
          <Text numberOfLines={1} adjustsFontSizeToFit style={tw`text-center`}>
            {!isInBookTab ? 'Go Social Media' : 'Go Books'}
          </Text>
        </TouchableOpacity>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};
