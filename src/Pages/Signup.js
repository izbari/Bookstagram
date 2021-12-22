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
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons'
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

  const [secret, setSecret] = React.useState(true);
  const [passwordOutlineColor,setPasswordOutlineColor] = React.useState('black')

  const emailHasErrors = () => {
    
    let pattern= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return pattern.test(email) == 0;
  };
  const passwordHasError = (params) => {
    const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
   
      if(strongRegex.test(password)) setPasswordOutlineColor("green");
    else if(mediumRegex.test(password)) setPasswordOutlineColor("orange" );
     else setPasswordOutlineColor( "red" );
    
  
    
  }
  
  
  const toggleModal = () => {
    if (checked) {
      setChecked(false);
    }
    setModalVisible(!isModalVisible);
  };


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
      <View style={{flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
      <Icon name='arrow-back-outline' size={25} color='white'  />
      <Text style={styles.header}>Welcome New User</Text>
      </View>
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
              theme={{ colors: { placeholder: 'black', text: 'black', primary: "black",underlineColor:'transparent',background : 'white'}}}

              onChangeText={name => setName(name)}
            />
            <TextInput
              value={lastName}
              mode="outlined"
              onChangeText={lastName => setLastName(lastName)}
              label="Last name"
              
              style={(styles.input, {width: 120, height: 40, marginLeft: 30})}
                          theme={{ colors: { placeholder: 'black', text: 'black', primary: "black",underlineColor:'transparent',background : 'white'}}}

            />
          </View>
          <TextInput
            style={styles.input}
            mode="outlined"
            selectionColor='#FF6EA1'  

                  underlineColor='transparent'
                  editable= {true}
                  right={<TextInput.Affix text={email.length+"/100"} />}
          error={email.length == 0 ? false :emailHasErrors()}
          theme={{ colors: { placeholder: 'black', text: 'black', primary: emailHasErrors()? 'black':'green',underlineColor:'transparent',background : '#003489'}}}

            label="Email"
            value={email}
            
            onChangeText={email => seteMail(email)}
          />
          <TextInput
            value={password}
            mode="outlined"
            
            onChangeText={password => {setPassword(password)
              passwordHasError()}}
            secureTextEntry={secret}
            label="Password"
            style={styles.input}
            theme={{ colors: { placeholder: 'black', text: 'black', primary: passwordOutlineColor,underlineColor:'transparent',background : '#003489'}}}
            right={<TextInput.Icon 
              forceTextInputFocus={false}
              onPress={() => setSecret(!secret)}
            name="eye" color="grey" style={{marginTop:15}}/>}
          />
          
          <TextInput
            value={passwordAgain}
            style={styles.input}
            error={password != passwordAgain}
            theme={{ colors: { placeholder: 'black', text: 'black', primary: "green",underlineColor:'transparent',background : '#003489'}}}

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
            style= {{borderColor: 'white',
            borderRadius: 5,
            borderWidth:2,
            paddingLeft:15,
            borderColor: moment(birth,"DD-MM-YYYY").isValid() ? 'green' : 'red',
            width: 290,
            height: 40,
            alignSelf: 'center',
            justifyContent: 'center',
            margin: 10,
            marginBottom: 10,
            backgroundColor: 'white',}}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={"black"}
            
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
                fallowers: [],
                fallowing: [],
                books: [],
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
