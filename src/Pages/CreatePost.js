import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  View,
  TextInput,
  Text,
  Animated,
  Platform,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

import Loading from '../components/Loading';

const {width, height} = Dimensions.get('window');
const CreatePost = props => {
  const [image, setImage] = React.useState(null);
  const [height, setHeight] = React.useState(0);
  const [postText, setPostText] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [transferring, setTransferring] = React.useState(0);

  React.useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => submitPost()}>
          <Text style={{color: 'white', fontStyle: 'italic', fontSize: 16}}>
            Post
          </Text>
        </TouchableOpacity>
      ),
    });
  });
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
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    console.log('filename datası', filename);
    setUploading(true);
    setTransferring(0);
    const task = storage().ref(filename).putFile(uploadUri);
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
      await storage().ref(filename).putFile(uploadUri);
      setUploading(false);
      Alert.alert(
        'Image Uploaded Successfully',
        'Your Image successfully uploaded to the Firebase Cloud Storage Successfully.',
      );
    } catch (error) {
      console.log(error);
    }
    setImage(null);
  };

  const selectFromGallery = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      console.log('image pathi', image.path);
      setImage(imageUri);
    });
  };

  const takePhotoByCamera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
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
          height: height + 20,
          padding: 10,
          margin: 10,
          justifyContent: 'center',
          alignSelf: 'center',
          borderRadius: 10,
          borderColor: '#BFBFBF',
          borderWidth: 1,
        }}>
        <TextInput
          onContentSizeChange={event => {
            setHeight(event.nativeEvent.contentSize.height);
          }}
          style={{height: Math.max(35, height), padding: 5, margin: 10}}
          value={postText}
          multiline
          autoCorrect
          numberOfLines={7}
          placeholder={'What are u thinking ?'}
          onChangeText={setPostText}
          defaultValue={postText}
        />
      </View>

      {image !== null ? (
        <Image style={styles.image} source={{uri: image}} />
      ) : null}
      <ActionButton buttonColor="#FF6EA1">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Take Photo"
          onPress={() => takePhotoByCamera()}>
          <Icon name="camera" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#3498db"
          title="Choose Photo"
          onPress={() => selectFromGallery()}>
          <Icon name="image" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
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
