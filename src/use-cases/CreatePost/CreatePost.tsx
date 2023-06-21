import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
  Alert,
  Keyboard,
  Text,
  TextInput,
  SafeAreaView,
} from 'react-native';
import tw from 'twrnc';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

import firestore from '@react-native-firebase/firestore';

import Ionicons from 'react-native-vector-icons/Ionicons';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedKeyboard,
} from 'react-native-reanimated';
import Entypo from 'react-native-vector-icons/Entypo';

import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {RouteNames} from '../../components/navigation/RouteNames';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import {IWithNavigation} from '../../components/navigation/Types';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useKeyboardVisible} from '../../infrastructure/Utils/useKeyboardVisible';
const {width} = Dimensions.get('window');
const VISIBILITIES = {
  0: 'Anyone',
  1: 'Connections',
  2: 'Group',
};
type ICreatePostProps = IWithNavigation<RouteNames.createPost>;
export const CreatePost: React.FunctionComponent<ICreatePostProps> = ({
  navigation,
}) => {
  const user = useAppSelector(store => store.user.user);
  const textInputRef = React.useRef(null);
  const bottomSheetRef = React.useRef(null);
  const scrollViewRef = React.useRef(null);

  const [text, setText] = React.useState('');
  const [image, setImage] = React.useState(null);
  const [transferring, setTransferring] = React.useState(0);
  const [content, setContent] = React.useState('actions');
  const [visibilityPreference, setVisibilityPreference] = React.useState(0);
  const snapPoints = React.useMemo(() => ['50%'], []);
  const isKeyboardVisible = useKeyboardVisible();
  const keyboard = useAnimatedKeyboard();
  const animatedBottomPoze = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -keyboard.height.value,
        },
      ],
    };
  });
  const height = useSharedValue(60);

  const animatedHeight = useAnimatedStyle(() => {
    return {
      height: withTiming(height.value),
    };
  });
  const handleKeyboardPress = () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
    } else {
      textInputRef.current?.focus?.();
    }
  };
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
    }, [id, setVisibilityPreference]);
    return (
      //Linkedin style
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSelect}
        style={tw`flex-row items-center justify-between mb-2`}>
        <View style={tw`flex-row items-center`}>
          {icon}
          <View style={tw`justify-center ml-3 `}>
            {!!title && <Text>{title}</Text>}
            {!!subtitle && <Text>{subtitle}</Text>}
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

        <View style={tw`py-4 gap-4`}>
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
        <TouchableOpacity
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
        </TouchableOpacity>
        <TouchableOpacity
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
        </TouchableOpacity>
      </>
    );
  };
  const submitPost = async imageUrl => {
    console.log(imageUrl);
    await firestore()
      .collection('posts')
      .add({
        userId: user.id,
        userName: user.name + ' ' + user.lastName,
        userImageUrl: user.imageUrl,
        post: text,
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        likes: [],
        comments: [],
        targetUser: '',
      })
      .then(() => navigation.navigate(RouteNames.landing))
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
    ImagePicker?.openPicker?.({
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
  const handleDotsPress = () => {
    height.value = 0;
    Keyboard.dismiss();
    bottomSheetRef?.current?.snapToIndex(0);
  };
  React.useEffect(() => {
    console.log('calisti');
    scrollViewRef.current?.scrollToEnd?.({animated: true});
  }, [text]);
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View
        style={tw`bg-white flex-row 
        items-center justify-between px-5 py-2 z-2 shadow-md`}>
        <TouchableOpacity
          onPress={() => navigation.navigate(RouteNames.landing)}>
          <Ionicons name="close" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!image && !text.length}
          onPress={() => {
            Alert.alert('Are you sure to share this post?', undefined, [
              {
                text: 'Cancel',
                onPress: () => undefined,
                style: 'cancel',
              },
              {text: 'Accept', onPress: () => uploadImage(image)},
            ]);
          }}>
          <Text style={tw`font-bold text-[#000] text-base mr-2`}>Post</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAwareScrollView
        enableOnAndroid
        ref={scrollViewRef}
        contentContainerStyle={tw`bg-white `}>
        <View style={tw`flex-1 justify-between`}>
          <View style={tw`flex-1`}>
            <View style={tw`py-4 pl-4 flex-row`}>
              <Image
                source={{uri: user?.imageUrl}}
                style={tw`w-12 h-12 rounded-full`}
              />
              <View style={tw`pl-3`}>
                <Text style={tw`text-black mb-1`}>
                  {user?.name + ' ' + user?.lastName}
                </Text>

                <TouchableOpacity onPress={visibilityPreferencesPress}>
                  <View
                    style={tw`flex-row rounded-3xl border border-black p-.5 px-2`}>
                    <Ionicons name="earth" size={18} color="black" />
                    <Text style={tw`mx-1 font-bold`}>
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
              ref={textInputRef}
              multiline
              textAlignVertical="top"
              autoCorrect={false}
              onChangeText={setText}
              placeholder="What do you want to talk about?"
              placeholderTextColor={'#6B6E70'}
              style={[tw` px-6 text-lg p-6 pt-0`]}
            />

            {!isKeyboardVisible && image !== null ? (
              <Image style={styles.image} source={{uri: image}} />
            ) : null}
          </View>
        </View>
      </KeyboardAwareScrollView>
      <BottomSheet
        onChange={handleBottomSheetChanges}
        style={tw`shadow-md rounded-t-xl`}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        // eslint-disable-next-line react/no-unstable-nested-components
        backdropComponent={backdropProps => (
          <BottomSheetBackdrop {...backdropProps} disappearsOnIndex={-1} />
        )}>
        <BottomSheetScrollView style={tw`p-2`}>
          {content === 'preferences' ? (
            <PostVisibiltyContent />
          ) : (
            <PostContentActions />
          )}
        </BottomSheetScrollView>
      </BottomSheet>
      <Animated.View
        style={[
          tw`flex-row bg-white items-center shadow-lg justify-between px-6 `,
          animatedBottomPoze,
          animatedHeight,
        ]}>
        <View style={tw`flex-row `}>
          <TouchableOpacity onPress={takePhotoByCamera}>
            <Ionicons
              name="camera"
              size={26}
              color="#6B6E70"
              style={tw`mr-4`}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={selectFromGallery}>
            <Ionicons name="image" size={26} color="#6B6E70" style={tw`mr-4`} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDotsPress}>
            <Ionicons
              name="ellipsis-horizontal"
              size={26}
              color="#6B6E70"
              style={tw`mr-4`}
            />
          </TouchableOpacity>
        </View>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            style={tw`flex-row items-center justify-center`}
            onPress={visibilityPreferencesPress}>
            <Ionicons name="earth" size={18} color="#6B6E70" />
            <Text style={tw`font-bold text-[#6B6E70] m-1`}>Anyone</Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`ml-2`} onPress={handleKeyboardPress}>
            <Entypo name="keyboard" size={18} color="#6B6E70" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
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
