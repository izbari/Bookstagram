// Formik x React Native example
import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,ScrollView,
  Image,KeyboardAvoidingView,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import {Formik} from 'formik';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-date-picker';
import {TextInputMask} from 'react-native-masked-text';
import {Button} from 'react-native-paper';

const EditProfile = props => {
  const user = props.route.params.user;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [openDate, setOpenDate] = useState(false);
  const [image, setImage] = React.useState(user.imageUrl);

  const [date, setDate] = useState(user.birth);
  
  const [items, setItems] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ]);
  console.log('id', user.id);

  console.log('date', date);

  function convertTimeStamp(str) {
    var date = new Date(str),
      mnth = ('0' + (date.getMonth() + 1)).slice(-2),
      day = ('0' + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join('/');
  }

  const selectFromGallery = () => {
    ImagePicker.openPicker({
      width: 150,
      height: 150,
      cropping: true,
    }).then(image => {
      console.log(image);
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
      console.log('image pathi', image.path);
      setImage(imageUri);
    });
  };
  const saveChanges = async values => {
    setLoading(true);
    const check = await uploadImage();
    if (!check) {
      database()
        .ref('/users/' + user.id)
        .update({
          name: values.Fullname.split(' ')[0],
          lastName: values.Fullname.substring(values.Fullname.indexOf(' ') + 1),
          gender: values.gender,
          birth: values.birth,
        })
        .then(() => {
          props.navigation.goBack();

          setLoading(false);
        });
    } else {
      console.log('path: /users/' + user.id);
      database()
        .ref('/users/' + user.id)
        .update({
          name: values.Fullname.split(' ')[0],
          lastName: values.Fullname.substring(values.Fullname.indexOf(' ') + 1),
          gender: values.gender,
          birth: values.birth,
          imageUrl: check,
        })
        .then(() => {
          setLoading(false);
          props.navigation.goBack();
        });
    }
  };

  const uploadImage = async () => {
    if (image == null || image == user.imageUrl) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    console.log('filename datası', filename);

    const extension = filename.split('.').pop(); //jpg
    const name = filename.split('.').slice(0, -1).join('.'); //name
    filename = name + Date.now() + '.' + extension;

    const storageRef = storage().ref(`profilePhotos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    try {
      await task;
      const url = await storageRef.getDownloadURL();
      props.navigation.goBack();

      return url;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{flex:1}}>      
    <Image
        style={{
          height: 150,
          width: 150,
          resizeMode: 'contain',
          borderRadius: 50,
          overflow: 'hidden',
          margin: 15,
          alignSelf: 'center',
        }}
        source={{
          uri: image ? image : user.imageUrl,
        }}
      />
      <View>
        <TouchableOpacity
          onPress={() => selectFromGallery()}
          style={{
            justifyContent: 'center',

            borderRadius: 5,
            borderColor: '#DDDDDD',
            borderWidth: 1,
            width: 140,
            height: 35,
            marginTop: 10,
            alignSelf: 'center',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#4C4C4C',
            }}>
            Upload Photo
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            marginTop: 10,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 12,
            color: '#7D7D7D',
            marginBottom: 20,
          }}>
          At least 256 x 256px PNG or JPG file.
        </Text>
      </View>

      <Formik
        initialValues={{
          email: user.email,
          Fullname: user.name + ' ' + user.lastName,
          gender: user.gender,
          birth: user.birth,
        }}
        onSubmit={values => {
          values.birth = date;
          console.log(values);
          saveChanges(values);
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <>
            <Text style={{marginLeft: 15, color: '#8A8A8A'}}>Email</Text>
            <TextInput
              name="email"
              placeholder="Email Address"
              editable={false}
              style={[styles.textInput, {marginTop: 5}]}
              selectTextOnFocus={false}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
            />
            <Text style={{marginLeft: 15, color: '#8A8A8A'}}>Full Name</Text>
            <TextInput
              name="fullname"
              style={[styles.textInput, {marginTop: 5}]}
              placeholder="Fullname"
              onChangeText={handleChange('Fullname')}
              onBlur={handleBlur('Fullname')}
              value={values.Fullname}
            />
            <Text style={{marginLeft: 15, color: '#8A8A8A'}}>Gender</Text>
            <DropDownPicker
              open={open}
              value={value ? value : values.gender}
              items={items}
              style={[styles.textInput, {marginTop: 5}]}
              setOpen={setOpen}
              onChangeValue={handleChange('gender')}
              setValue={setValue}
              setItems={setItems}
              dropDownContainerStyle={{
                backgroundColor: 'white',
                width: '95%',
                margin: 4,
                marginLeft: 12,
                borderColor: '#C0C0C0',
              }}
            />
            <Text style={{marginLeft: 15, color: '#8A8A8A'}}>
              Birth of Date
            </Text>
            <View style={{flexDirection: 'row'}}>
              <TextInputMask
                type={'datetime'}
                options={{
                  format: 'DD/MM/YYYY',
                }}
                value={date}
                onChangeText={setDate}
                style={[
                  styles.textInput,
                  {width: '85%', paddingLeft: 5, marginTop: 5},
                ]}
                placeholder="DD/MM/YYYY"
              />
              <TouchableOpacity onPress={() => setOpenDate(true)}>
                <Ionicons
                  style={{marginLeft: -10}}
                  name="calendar"
                  size={43}
                  color="#BFBFBF"
                />
              </TouchableOpacity>
            </View>
            <>
              <DatePicker
                modal
                mode="date"
                open={openDate}
                date={new Date()}
                onDateChange={date => handleChange('birth', date)}
                onConfirm={date => {
                  setOpenDate(false);
                  setDate(convertTimeStamp(date));
                }}
                onCancel={() => {
                  setOpenDate(false);
                }}
              />
            </>

            <Button
              onPress={handleSubmit}
              style={{
                borderRadius: 5,
                borderColor: '#DDDDDD',
                borderWidth: 1,
                width: 300,
                height: 35,
                marginTop: 10,
                alignSelf: 'center',
              }}
              loading={loading}
              mode="contained"
              compact={true}>
              Press me
            </Button>
          </>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  loginContainer: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    elevation: 10,
    backgroundColor: '#e6e6e6',
  },
  textInput: {
    height: 40,
    width: '95%',
    margin: 12,
    padding: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
  },
});
export default EditProfile;
