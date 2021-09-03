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
import {TextInput} from 'react-native-paper';
import Welcome from '../components/Yoga'

function App(props) {
  const [mail, setMail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <SafeAreaView style={styles.mainContainer}>
              <Text style={styles.header}>WELCOME BACK !</Text>

      <View style={styles.lottieContainer}>
      <Welcome/>
      </View>
     
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          mode='outlined'
          label="Email"
          value={mail}
          right={<TextInput.Affix text="/100" />}
          onChangeText={mail => setMail(mail)}
        />
        <TextInput
          value={password}
          mode='outlined'
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
          onPress={() => props.navigation.navigate('Main')}>
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
  header:{color:"white",fontSize:24,fontWeight:'bold',alignSelf:'center',margin:10},
});

export default App;
