import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import tw from 'twrnc';
import {Text, Button, IconButton, ActivityIndicator} from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import {useSelector} from 'react-redux';

import firestore from '@react-native-firebase/firestore';
import {TextInput} from 'react-native-element-textinput';

import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {useRef} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import {useKeyboardHeight} from '../utils/keyboardListener';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {LoadingModal} from '../components/LoadingModal';
const {width, height: screenHeight} = Dimensions.get('window');
const VISIBILITIES = {
  0: 'Anyone',
  1: 'Connections',
  2: 'Group',
};
const CreatePost = ({navigation}) => {
  const {
    id,
    name,
    lastName,
    imageUrl: userImageUrl,
  } = useSelector(store => store.user);

  const bottomSheetRef = useRef(null);
  const [text, setText] = useState('');
  const [image, setImage] = React.useState(null);
  const [transferring, setTransferring] = React.useState(0);
  const [inputHeight, setInputHeight] = useState(50);
  const [maxHeightValue, setMaxHeightValue] = useState(50);
  const [content, setContent] = useState('actions');
  const [visibilityPreference, setVisibilityPreference] = useState(0);
  const snapPoints = React.useMemo(() => ['50%'], []);
  const keyboardHeight = useKeyboardHeight();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          disabled={!image && !text.length}
          onPress={() => {
            Alert.alert('Are you sure to share this post?', null, [
              {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
              },
              {text: 'Accept', onPress: () => uploadImage(image)},
            ]);
          }}>
          <Text style={{color: 'white', fontStyle: 'italic', fontSize: 16}}>
            Post
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, setText, text, height, image, setImage]);
  const height = useSharedValue(60);
  const bottom = useSharedValue(0);

  const animatedHeight = useAnimatedStyle(() => {
    return {
      height: withTiming(height.value),
    };
  });
  const animatedBottom = useAnimatedStyle(() => {
    return {
      bottom: withTiming(bottom.value),
    };
  });

  useEffect(() => {
    setMaxHeightValue(
      Math.max(
        inputHeight,
        keyboardHeight === 0
          ? 0
          : (screenHeight - keyboardHeight) / 2 -
              (Platform.OS === 'ios' ? 35 : 0),
      ),
    );
    keyboardHeight > 0 ? bottomSheetRef.current?.close() : null;
    bottom.value = keyboardHeight;
  }, [keyboardHeight, inputHeight]);

  const CustomRadioButton = ({
    id,
    title,
    subtitle,
    icon,
    visibilityPreference,
    setVisibilityPreference,
  }) => {
    const selected = visibilityPreference === id;
    // const [isSelected, setIsSelected] = useState(false);
    const handleSelect = React.useCallback(() => {
      setVisibilityPreference(id);
    }, [id]);
    return (
      //Linkedin style
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSelect}
        style={tw`flex-row item-center justify-between mb-2`}>
        <View style={tw`flex-row items-center`}>
          {icon}
          <View style={tw`justify-center ml-3 `}>
            {!!title && <Text variant="titleMedium">{title}</Text>}
            {!!subtitle && <Text variant="bodyMedium">{subtitle}</Text>}
          </View>
        </View>
        <View
          style={tw`w-6 h-6 rounded-full self-center border-2 justify-center items-center ${
            selected ? 'border-[#FF6EA1]' : 'border-gray-600'
          }`}>
          {selected && <View style={tw`w-4 h-4 rounded-full bg-[#FF6EA1]`} />}
        </View>
      </TouchableOpacity>
    );
  };

  const PostVisibiltyContent = () => {
    return (
      <View style={tw`p-2`}>
        <Text variant="titleLarge" style={tw`font-bold`}>
          Who can see this post?
        </Text>
        <Text style={tw`text-sm pt-2`}>
          Your post will be visible on feed, on your profile and in search
          results
        </Text>

        <View style={tw`py-4`}>
          <CustomRadioButton
            id={0}
            title="Anyone"
            subtitle={'Anyone on or off Bookstagram'}
            icon={<Ionicons name={'earth'} size={30} color="#6B6E70" />}
            setVisibilityPreference={setVisibilityPreference}
            visibilityPreference={visibilityPreference}
          />
          <CustomRadioButton
            id={1}
            title="Connections only"
            subtitle={'Connections on Bookstagram'}
            icon={<Ionicons name={'people'} size={30} color="#6B6E70" />}
            setVisibilityPreference={setVisibilityPreference}
            visibilityPreference={visibilityPreference}
          />
          <CustomRadioButton
            id={2}
            title="Group"
            subtitle={"Select a group you're in"}
            icon={<FontAwesome5Icon name={'users'} size={24} color="#6B6E70" />}
            setVisibilityPreference={setVisibilityPreference}
            visibilityPreference={visibilityPreference}
          />
        </View>
      </View>
    );
  };
  const PostContentActions = () => {
    return (
      <>
        <Button
          buttonColor="white"
          textColor="lightgray"
          contentStyle={tw`justify-start`}
          style={tw`rounded-0`}
          labelStyle={tw`text-gray-600 text-base text-2xl`}
          icon={'camera'}
          onPress={selectFromGallery}>
          <Text style={tw`text-base text-gray-600 font-medium`}>
            Add a photo
          </Text>
        </Button>
        <Button
          buttonColor="white"
          textColor="lightgray"
          contentStyle={tw`justify-start`}
          style={tw`rounded-0`}
          labelStyle={tw`text-gray-600  text-base text-2xl`}
          icon={'image'}
          onPress={takePhotoByCamera}>
          <Text style={tw`text-base text-[#6B6E70] font-medium`}>
            Take a photo
          </Text>
        </Button>
      </>
    );
  };
  const submitPost = async imageUrl => {
    console.log(imageUrl);
    await firestore()
      .collection('posts')
      .add({
        userId: id,
        userName: name + ' ' + lastName,
        userImageUrl: userImageUrl,
        post: text,
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        likes: [],
        comments: [],
        targetUser: '',
      })
      .then(navigation.goBack)
      .catch(err => console.log('ERROR:', err.msg));
  };

  const uploadImage = async image => {
    if (image == null) {
      return submitPost(null);
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    const extension = filename.split('.').pop(); //jpg
    const name = filename.split('.').slice(0, -1).join('.'); //name
    filename = name + Date.now() + '.' + extension;

    setTransferring(0);
    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
      setTransferring(
        Math.round(
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100,
        ),
      );
    });
    try {
      await task;
      const url = await storageRef.getDownloadURL();
      return submitPost(url);
    } catch (error) {
      console.log(error);
      return null;
    }
  };
  const visibilityPreferencesPress = () => {
    Keyboard.dismiss();
    bottomSheetRef?.current?.snapToIndex(0);
    height.value = 0;
    setContent('preferences');
  };
  const selectFromGallery = () => {
    ImagePicker.openPicker({
      width: 1080,
      height: 1920,
      cropping: true,
    })
      .then(image => {
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
        bottomSheetRef?.current?.close();
        height.value = 60;
      })
      .catch(err => {
        console.log(err.msg);
      });
  };

  const takePhotoByCamera = () => {
    ImagePicker.openCamera({
      width: 1080,
      height: 1920,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
        console.log('image pathi', image.path);
        bottomSheetRef?.current?.close();
        height.value = 60;
      })
      .catch(err => {
        console.log(err.msg);
      });
  };
  const handleBottomSheetChanges = React.useCallback(props => {
    console.log(Platform.OS + ' ' + props);
    if (props === 0) {
      height.value = 0;
    } else if (props === -1) {
      height.value = 60;
    }
  }, []);

  return (
    <KeyboardAvoidingView style={tw`flex-1 bg-white`} behavior="height">
      <>
        <LoadingModal
          modalVisible={transferring !== 0}
          task={transferring + ' %'}
          value={transferring}
        />
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={tw`flex-1 justify-between`}>
            <View style={tw`flex-1 `}>
              <View style={tw`w-full self-center p-6 pt-8 flex-row`}>
                <Image
                  source={{uri: userImageUrl}}
                  style={tw`w-12 h-12 rounded-full`}
                />
                <View style={tw`pl-3`}>
                  <Text variant="titleMedium" style={tw`text-black mb-1`}>
                    {name + ' ' + lastName}
                  </Text>

                  <TouchableOpacity onPress={visibilityPreferencesPress}>
                    <View
                      style={tw`flex-row rounded-3xl border border-black p-.5 px-2`}>
                      <Ionicons name="earth" size={18} color="black" />
                      <Text variant="titleSmall" style={tw`mx-1 font-bold`}>
                        {VISIBILITIES[visibilityPreference]}
                      </Text>
                      <Ionicons
                        name="caret-down-outline"
                        size={18}
                        color="black"
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <TextInput
                showSoftInputOnFocus
                multiline
                textAlignVertical="top"
                autoCorrect={false}
                renderRightIcon={() => null}
                onChangeText={setText}
                placeholder="What do you want to talk about?"
                placeholderTextColor={`#6B6E70`}
                onContentSizeChange={event => {
                  const {height} = event.nativeEvent.contentSize;
                  setInputHeight(height);
                }}
                style={[
                  tw`h-full px-6 text-lg`,
                  {
                    maxHeight: maxHeightValue,
                  },
                ]}
                inputStyle={tw([text ? `text-xl` : `text-2xl`])}
              />

              {image !== null ? (
                <Image style={styles.image} source={{uri: image}} />
              ) : null}
            </View>

            <Animated.View
              style={[
                tw`flex-row bg-white items-center shadow-md justify-between w-full px-6 h-0 `,
                animatedBottom,
                animatedHeight,
              ]}>
              <View style={tw`flex-row `}>
                <IconButton
                  icon="camera"
                  onPress={takePhotoByCamera}
                  iconColor="#6B6E70"
                />
                <IconButton
                  icon="image"
                  onPress={selectFromGallery}
                  iconColor="#6B6E70"
                />
                <IconButton
                  icon="dots-horizontal"
                  onPress={() => {
                    height.value = 0;
                    Keyboard.dismiss();
                    bottomSheetRef?.current?.snapToIndex(0);
                  }}
                  iconColor="#6B6E70"
                />
              </View>
              <Button
                textColor="gray"
                contentStyle={tw`h-7 m-2 `}
                labelStyle={tw`text-xl my-1 `}
                style={tw`items-center flex-row justify-center `}
                icon="earth"
                onPress={visibilityPreferencesPress}>
                <Text variant="titleSmall" style={'font-bold text-[#6B6E70]'}>
                  Anyone
                </Text>
              </Button>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
        <BottomSheet
          onChange={handleBottomSheetChanges}
          style={tw`shadow-md  rounded-t-xl`}
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          backdropComponent={backdropProps => (
            <BottomSheetBackdrop
              {...backdropProps}
              appearsOnIndex={0}
              pressBehavior={'close'}
              enableTouchThrough={true}
              disappearsOnIndex={-1}
            />
          )}>
          <BottomSheetScrollView style={tw`p-2`}>
            {content === 'preferences' ? (
              <PostVisibiltyContent />
            ) : (
              <PostContentActions />
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      </>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  image: {
    marginTop: 20,
    alignSelf: 'center',
    height: 280,
    width: width * 0.9,
    resizeMode: 'cover',
  },
  lottieContainer: {
    width: '10%',
    height: '5%',
    alignSelf: 'center',
  },
});
export default CreatePost;
