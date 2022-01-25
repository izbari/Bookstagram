import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Button,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  TextInput,
  RadioButton,
  Checkbox,
  Portal,
  Text,
  Modal,
} from 'react-native-paper';
import {TextInputMask} from 'react-native-masked-text';
import moment from 'moment';
import Welcome from '../components/Welcome';
import AuthController from '../controllers/authController';
import terms from '../utils/terms';
import {useDispatch} from 'react-redux';

//main methods
function Signup(props) {
  //States ,effects, vars
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);
  const [bottom, setBottom] = React.useState(true);
  const hideModal = () => {
    setVisible(false);
    setBottom(true);
  };
  const [name, setName] = React.useState('');
  const [lastName, setLastName] = React.useState('');

  const [email, seteMail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordAgain, setPasswordAgain] = React.useState('');

  const [birth, setBirth] = React.useState('');

  const [gender, setGender] = React.useState('');
  const [checked, setChecked] = React.useState(false);

  const [secret, setSecret] = React.useState(true);
  const [passwordOutlineColor, setPasswordOutlineColor] =
    React.useState('black');

  const emailHasErrors = () => {
    let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return pattern.test(email) == 0;
  };
  const passwordHasError = params => {
    const strongRegex = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
    );
    const mediumRegex = new RegExp(
      '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})',
    );

    if (strongRegex.test(password)) setPasswordOutlineColor('green');
    else if (mediumRegex.test(password)) setPasswordOutlineColor('orange');
    else setPasswordOutlineColor('red');
  };

  const signUpHandler = () => {
    const newUser = {
      email: email,
      password: password,
      passwordAgain: passwordAgain,
      name: name,
      lastName: lastName,
      birth: birth,
      gender: gender,
      imageUrl: `https://ui-avatars.com/api/?name=${name}-${lastName}&background=random`,
      fallowers: ['initial'],
      fallowing: ['initial'],
      books: ['initial'],
      terms: checked,
    };

    AuthController.createUser(newUser,props);
    dispatch({type: 'SET_ROUTE_NAME', payload: {routeName: "Signup"}});

  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height;
  };

  const TermsPopup = () => {
    return (
      <View>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.containerStyle}>
            <View style={{flex: 1, padding: 20}}>
              <WebView
                originWhitelist={['*']}
                onScroll={({nativeEvent}) => {
                  if (isCloseToBottom(nativeEvent)) {
                    setBottom(false);
                  }
                }}
                scrollEventThrottle={400}
                showsVerticalScrollIndicator={false}
                startInLoadingState={false}
                scalesPageToFit={false}
                source={{
                  html: ` 
                  <head>
                    <meta content="width=width, initial-scale=1, maximum-scale=0.8" name="viewport"></meta>
                  </head>
                  <body style="background-image" size: ${terms}`,
                }}
                style={{flex: 1, padding: 20}}
              />
            </View>
            <Button
              title="Accept Terms and Policies"
              style={{marginTop: 30}}
              onPress={() => {
                hideModal();
                setChecked(true);
              }}
              disabled={bottom}></Button>
          </Modal>
        </Portal>
      </View>
    );
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={{flex:1, backgroundColor: '#FF6EA1'}}>   
      <Text style={styles.header}>Welcome New User</Text>

      <View style={styles.lottieContainer}>
        <Welcome />
      </View>
      <ScrollView>
        
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <TextInput
            style={
              (styles.input,
              {
                width: 135,
                height: 40,
                borderColor: 'red',
                margin:0
              })
            }
            mode="outlined"
            label="Name"
            value={name}
            theme={{
              colors: {
                placeholder: 'black',
                text: 'black',
                primary: 'black',
                underlineColor: 'transparent',
                background: 'white',
              },
            }}
            onChangeText={name => setName(name)}
          />
          <TextInput
            value={lastName}
            mode="outlined"
            onChangeText={lastName => setLastName(lastName)}
            label="Last name"
            style={(styles.input, {width: 135, height: 40,margin:0})}
            theme={{
              colors: {
                placeholder: 'black',
                text: 'black',
                primary: 'black',
                underlineColor: 'transparent',
                background: 'white',
              },
            }}
          />
        </View>
        <TextInput
          style={styles.input}
          mode="outlined"
          selectionColor="#FF6EA1"
          underlineColor="transparent"
          editable={true}
          right={<TextInput.Affix text={email.length + '/100'} />}
          error={email.length == 0 ? false : emailHasErrors()}
          theme={{
            colors: {
              placeholder: 'black',
              text: 'black',
              primary: emailHasErrors() ? 'black' : 'green',
              underlineColor: 'transparent',
              background: '#003489',
            },
          }}
          label="Email"
          value={email}
          onChangeText={email => seteMail(email)}
        />
        <TextInput
          value={password}
          mode="outlined"
          onChangeText={password => {
            setPassword(password);
            passwordHasError();
          }}
          secureTextEntry={secret}
          label="Password"
          style={styles.input}
          theme={{
            colors: {
              placeholder: 'black',
              text: 'black',
              primary: passwordOutlineColor,
              underlineColor: 'transparent',
              background: '#003489',
            },
          }}
          right={
            <TextInput.Icon
              forceTextInputFocus={false}
              onPress={() => setSecret(!secret)}
              name={secret ? 'eye-off' : 'eye'}
              color="grey"
              style={{marginTop: 15}}
            />
          }
        />

        <TextInput
          value={passwordAgain}
          style={styles.input}
          error={password != passwordAgain}
          theme={{
            colors: {
              placeholder: 'black',
              text: 'black',
              primary: 'green',
              underlineColor: 'transparent',
              background: '#003489',
            },
          }}
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
          style={{
            borderColor: 'white',
            borderRadius: 5,
            borderWidth: 1,
            paddingLeft: 15,
            borderColor:
              birth.length == 0
                ? 'black'
                : moment(birth, 'DD-MM-YYYY').isValid()
                ? 'green'
                : 'red',
            width: 290,
            height: 40,
            alignSelf: 'center',
            justifyContent: 'center',
            margin: 10,
            marginBottom: 10,
            backgroundColor: 'white',
          }}
          placeholder="DD/MM/YYYY"
          placeholderTextColor={'black'}
        />

        <RadioButton.Group style={{backgroundColor: 'black'}} onValueChange={setGender} value={gender}>
          <View
            style={{
            
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              margin: 10,
            }}>
            <View style={{flexDirection: 'row'}}>
              <RadioButton value="Male" color={'white'} />
              <Text style={{marginTop: 8, fontSize: 15}}>Male</Text>
            </View>
            <View style={{flexDirection: 'row', marginLeft: 70}}>
              <RadioButton value="Female" color={'white'} />
              <Text style={{marginTop: 8, fontSize: 15}}>Female</Text>
            </View>
          </View>
        </RadioButton.Group>
        <View style={{flexDirection: 'row',justifyContent: 'center'}}>
          <Checkbox.Item
            color={'white'}
            labelStyle={{fontSize: 12, fontStyle: 'italic'}}
            style={{fontSize: 12}}
            status={checked ? 'checked' : 'unchecked'}
            label={'I accept the Terms in the License Agreement.'}
            position="leading"
            onPress={() => {
              if (checked) {
                setChecked(false);
              } else {
                setVisible(true);
              }
            }}
          />
        </View>
        {visible && <TermsPopup />}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            signUpHandler();
          }}>
          <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  containerStyle: {backgroundColor: 'white', flex: 1, margin: 15},
  mainContainer: {flex: 1, backgroundColor: '#FF6EA1'},
  lottieContainer: {
    flex: 5,
    width: '85%',
    height: '50%',
    alignSelf: 'center',
  },
  inputContainer: {
    flex: 3,
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  buttonContainer: {margin: 10, marginBottom: 20},
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
    marginTop: 20,
    marginBottom: 0,
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
