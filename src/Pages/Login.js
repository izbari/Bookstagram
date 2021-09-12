import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Language from '../utils/Languages/lang';
import authController from '../controllers/authController';
import {TextInput} from 'react-native-paper';
import Welcome from '../components/Yoga';
function App(props) {
  const [checkFirst, setCheckFirst] = React.useState(false);

  const [email, seteMail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.header}>WELCOME BACK !</Text>

      <View style={styles.lottieContainer}>
        <Welcome />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          mode="outlined"
          label="Email"
          value={email}
          right={<TextInput.Affix text="/100" />}
          onChangeText={email => seteMail(email)}
        />
        <TextInput
          value={password}
          mode="outlined"
          onChangeText={password => setPassword(password)}
          secureTextEntry={true}
          label="Password"
          right={<TextInput.Icon name="eye" />}
          style={styles.input}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            let ideklenmisuser = 'k';
            try {
              if (!(props.route.params.user == undefined)) {
                console.log('user geldi', props.route.params.user);
                let user = props.route.params.user;
                console.log('sorun yok:', user);
                let yeniusermi = props.route.params.check;
                console.log('gelen check: ', yeniusermi);
                let ideklenmisuser = {...user, id: auth().currentUser.uid};

                console.log(ideklenmisuser);
                if (yeniusermi == true) {
                  let isNewUser = authController.userLogin(
                    props,
                    email,
                    password,
                    ideklenmisuser,
                    yeniusermi,
                  );
                  console.log('başardık dostum !:', isNewUser);
                } else {
                  let isNewUser = authController.userLogin(
                    props,
                    email,
                    password,
                    ideklenmisuser,
                  );
                  console.log('başardık dostum !:', isNewUser);
                }
              }
            } catch (err) {
              console.log(err);
              let isNewUser = authController.userLogin(
                props,
                email,
                password,
                ideklenmisuser,
              );
              console.log('başardık dostum !:', isNewUser);
            }
          }}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate('Signup')}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
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
    flex: 1.5,
  },
  buttonContainer: {flex: 1, margin: 10},
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
  },
});

export default App;
