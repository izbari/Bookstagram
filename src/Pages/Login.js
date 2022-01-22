import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import AuthController from '../controllers/authController';
import {TextInput} from 'react-native-paper';
import Welcome from '../components/Yoga';
import {useDispatch} from 'react-redux';

function Login(props) {
const dispatch = useDispatch();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [secret, setSecret] = React.useState(true);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.header}>WELCOME BACK !</Text>

      <View style={styles.lottieContainer}>
        <Welcome />
      </View>

      <View style={{flex: 2.5}}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            selectionColor="#FF6EA1"
            theme={{
              colors: {
                placeholder: 'black',
                text: 'black',
                primary: 'black',
                underlineColor: 'transparent',
                background: '#003489',
              },
            }}
            mode="outlined"
            label="Email"
            value={email}
            autoCapitalize="none"
            underlineColor="transparent"
            editable={true}
            onChangeText={email => setEmail(email)}
          />

          <TextInput
            value={password}
            mode="outlined"
            onChangeText={password => setPassword(password)}
            secureTextEntry={secret}
            label="Password"
            style={styles.input}
            theme={{
              colors: {
                placeholder: 'black',
                text: 'black',
                primary: 'black',
                underlineColor: 'transparent',
                background: '#003489',
              },
            }}
            right={
              <TextInput.Icon
                onPress={() => setSecret(!secret)}
                name="eye"
                color="grey"
                style={{marginTop: 15}}
              />
            }
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await AuthController.userLogin(props, email, password);
              dispatch({type: 'SET_ROUTE_NAME', payload: {routeName: "Login"}});
              props.navigation.navigate("Main")
              setEmail('');
              setPassword('');
            }}>
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate('Signup')}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#FF6EA1'},
  lottieContainer: {
    flex: 2.5,
    width: '90%',
    height: '35%',
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 50,
  },
  button: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    width: 250,
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
    alignSelf: 'center',
    paddingLeft: 12,
    borderRadius: 10,
    borderColor: 'white',

    width: 290,
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 10,
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
});

export default Login;
