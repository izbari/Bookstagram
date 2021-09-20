import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Button,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {TextInput, RadioButton, Checkbox} from 'react-native-paper';
import {TextInputMask} from 'react-native-masked-text';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

import Welcome from '../components/Welcome';
import Modal from 'react-native-modal';
import authController from '../controllers/authController';

//main method
function Signup(props) {
  //States ,effects, vars
  const [isModalVisible, setModalVisible] = React.useState(false);
  // AUTH
  const [name, setName] = React.useState('');
  const [lastName, setLastName] = React.useState('');

  const [email, seteMail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordAgain, setPasswordAgain] = React.useState('');

  const [birth, setBirth] = React.useState('');

  const [value, setValue] = React.useState('');
  const [checked, setChecked] = React.useState(false);

  const [isFirst, setIsFirst] = React.useState(false);
  //methods
  const toggleModal = () => {
    if (checked) {
      setChecked(false);
    }
    setModalVisible(!isModalVisible);
  };
  // const saveUserDatabase = async () => {
  //   const uuid = generateQuickGuid();
  //   console.log(uuid);
  //   await database().ref(`/users/${uuid}`).set({
  //     name: name,
  //     lastname: lastName,
  //     email: email,
  //     birth: birth,
  //     gender: value,
  //   });
  //   const user = {
  //     path: uuid,
  //     name: name,
  //     email: email,
  //     lastname: lastName,
  //     birth: birth,
  //     gender: value,
  //   };
  //   props.navigation.navigate('Login', {check: true, user: user});
  // };

  const MyComponent = () => {
    return (
      <View style={{flex: 1}}>
        <Modal isVisible={isModalVisible} animationType="slide">
          <WebView
            source={{
              uri: 'https://www.termsandconditionsgenerator.com/live.php?token=LyjK5wb6m1SBE0ap0KBS6uZCPEz6mu7y',
            }}
            style={{marginTop: 10, flex: 1}}
          />

          <Button
            title="Accept terms and Policies"
            onPress={() => {
              setChecked(true);
              setModalVisible(!isModalVisible);
            }}
          />
        </Modal>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.header}>Welcome New User</Text>
      <View style={styles.lottieContainer}>
        <Welcome />
      </View>
      <ScrollView>
        <View style={styles.inputContainer}>
          <View style={{flexDirection: 'row'}}>
            <TextInput
              style={
                (styles.input,
                {
                  width: 120,
                  height: 40,
                  marginRight: 20,
                  marginLeft: 10,
                  borderColor: 'red',
                })
              }
              mode="outlined"
              label="Name"
              value={name}
              onChangeText={name => setName(name)}
            />
            <TextInput
              value={lastName}
              mode="outlined"
              onChangeText={lastName => setLastName(lastName)}
              label="Last name"
              style={(styles.input, {width: 120, height: 40, marginLeft: 30})}
            />
          </View>
          <TextInput
            style={styles.input}
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={email => seteMail(email)}
          />
          <TextInput
            value={password}
            mode="outlined"
            onChangeText={password => setPassword(password)}
            secureTextEntry={true}
            label="Password"
            style={styles.input}
          />
          <TextInput
            value={passwordAgain}
            style={styles.input}
            mode="outlined"
            secureTextEntry={true}
            label="Password again"
            onChangeText={passAgain => setPasswordAgain(passAgain)}
          />
          <TextInputMask
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY',
            }}
            value={birth}
            onChangeText={birth => setBirth(birth)}
            style={styles.input}
            placeholder="DD/MM/YYYY"
          />

          <RadioButton.Group
            onValueChange={newValue => setValue(newValue)}
            value={value}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                margin: 10,
                marginLeft: 32,
              }}>
              <View style={{flexDirection: 'row'}}>
                <RadioButton value="Male" />
                <Text style={{marginTop: 8, fontSize: 15}}>Male</Text>
              </View>
              <View style={{flexDirection: 'row', marginLeft: 70}}>
                <RadioButton value="Female" />
                <Text style={{marginTop: 8, fontSize: 15}}>Female</Text>
              </View>
            </View>
          </RadioButton.Group>
          <View style={{flexDirection: 'row'}}>
            <Checkbox.Item
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => {
                if (checked) {
                  setChecked(!checked);
                } else {
                  toggleModal();
                }
              }}
            />
            <Text style={{marginTop: 15, marginRight: 0}}>I have read </Text>
            <Text
              style={{marginTop: 15, marginRight: 0, color: 'blue'}}
              onPress={() => setModalVisible(!isModalVisible)}>
              Terms and Policies
            </Text>
          </View>
          {isModalVisible && <MyComponent />}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              const user = {
                name: name,
                email: email,
                lastname: lastName,
                birth: birth,
                gender: value,
              };

              const condition = await authController.checkAuthConditions(
                user,
                password,
                passwordAgain,
                checked,
              );
              console.log('condition:', condition);
              let createdInAuth = 'k';
              const newUser = {
                email,
                password,
                name,
                lastName,
                birth,
                gender: value,
                imageUrl: `https://ui-avatars.com/api/?name=${name}-${lastName}&background=random`,
                fallowers: 0,
                fallowing: 0,
                books: ['java'],
              };
              if (condition) {
                createdInAuth = authController.createUser(newUser);
                console.log('creadtedIN:', createdInAuth);
                if (createdInAuth) {
                  console.log('Databasede oluştu.');

                  props.navigation.navigate('Login', {
                    user: newUser,
                    check: true,
                  });
                } else {
                  console.log('Databasede oluşturulamadı.');
                }
              }
            }}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#FF6EA1'},
  lottieContainer: {
    flex: 5,
    width: '85%',
    height: '30%',
    alignSelf: 'center',
  },
  inputContainer: {
    flex: 2,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonContainer: {margin: 10, justifyContent: 'flex-end'},
  button: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    width: 290,
    height: 38,
    backgroundColor: '#FF6EA1',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    borderColor: 'white',
    borderRadius: 10,

    borderColor: 'white',
    width: 290,
    height: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  header: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    margin: 10,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '90%',
    height: '90%',
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Signup;
