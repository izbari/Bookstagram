import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  Platform,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {FAB, Portal, Provider, TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';
import Loading from '../components/Loading';

const {width, height} = Dimensions.get('window');

const CreatePost = ({navigation}) => {
  const [text, setText] = useState('');
  const [fabVisible, setFabVisible] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [transferring, setTransferring] = React.useState(0);
  console.log(text);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setSaving(true);
          }}>
          <Text style={{color: 'white', fontStyle: 'italic', fontSize: 16}}>
            Post
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  useEffect(() => {
    if (saving) submitPost();
  }, [saving]);
  if (uploading) {
    return (
      <View
        style={{
          width: width * 0.9,
          height: '50%',
          flex: 1,
          alignSelf: 'center',
          justifyContent: 'space-around',
        }}>
        <Loading />
        <View>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 24,
            }}>{`${transferring}%`}</Text>
        </View>
      </View>
    );
  }
  const submitPost = async () => {
    const imageUrl = await uploadImage();
    console.log('url:', imageUrl);
    console.log('postText:', text);

    await firestore()
      .collection('posts')
      .add({
        userId: auth().currentUser.uid,
        post: text,
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        likes: [],
        comments: [],
      })
      .then(() => {
        navigation.navigate('HomeScreen', {newPost: true});
      })
      .catch(err => console.log('ERROR:', err.msg));
    console.log('Post added to firestore');
    setImage(null);
  };

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    console.log('filename datası', filename);

    const extension = filename.split('.').pop(); //jpg
    const name = filename.split('.').slice(0, -1).join('.'); //name
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
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
      setUploading(false);
      navigation.navigate('HomeScreen',{newPost:true});
      return url;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const selectFromGallery = () => {
    ImagePicker.openPicker({
      width: 1080,
      height: 1920,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        console.log('image pathi', image.path);
        setImage(imageUri);
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
      })
      .catch(err => {
        console.log(err.msg);
      });
  };
  return (
    <View style={{flex: 1, backgroundColor: '#f3f3f3'}}>
      <View
        style={{
          width: width * 0.9,
          margin: 10,
          justifyContent: 'center',
          alignSelf: 'center',
          borderColor: '#BFBFBF',
          borderWidth: 1,
        }}>
        <TextInput
          onChangeText={newText => setText(newText)}
          multiline
          underlineColor={'#BFBFBF'}
          activeUnderlineColor={'#BFBFBF'}
          placeholder="Please Write Something ..."
        />
      </View>

      {image !== null ? (
        <Image style={styles.image} source={{uri: image}} />
      ) : null}
      <Provider>
        <Portal>
          <FAB.Group
            open={fabVisible}
            color="white"
            fabStyle={{backgroundColor: '#FF6EA1'}}
            icon={fabVisible ? 'close' : 'plus'}
            actions={[
              {
                icon: 'camera',
                label: 'Take Photo',
                onPress: () => takePhotoByCamera(),
                small: false,
              },
              {
                icon: 'image',
                label: 'Choose Photo',
                onPress: () => selectFromGallery(),
                small: false,
              },
            ]}
            onStateChange={({open}) => setFabVisible(open)}
          />
        </Portal>
      </Provider>
    </View>
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
