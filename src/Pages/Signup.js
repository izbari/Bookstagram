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
import { TextInput, RadioButton,Checkbox  } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text'
import Welcome from '../components/Welcome'

function Signup(props) {

  const [mail, setMail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [value, setValue] = React.useState('');
  const [checked, setChecked] = React.useState(false);
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.header}>Welcome New User</Text>
      <View style={styles.lottieContainer}>
        <Welcome />
      </View>
      <ScrollView>

        <View style={styles.inputContainer}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.input, { width: 120, height: 40, marginRight: 20, marginLeft: 10, borderColor: 'red' }}
              mode='outlined'
              label="Name"
              value={mail}
              onChangeText={mail => setMail(mail)}
            />
            <TextInput
              value={password}
              mode='outlined'
              onChangeText={password => setPassword(password)}
              secureTextEntry={true}
              label="Last name"
              style={styles.input, { width: 120, height: 40, marginLeft: 30, }}
            />

          </View>
          <TextInput
            style={styles.input}
            mode='outlined'
            label="Email"
            value={mail}
            onChangeText={mail => setMail(mail)}
          />
          <TextInput
            value={password}
            mode='outlined'
            onChangeText={password => setPassword(password)}
            secureTextEntry={true}
            label="Password"
            style={styles.input}
          />
          <TextInput
            style={styles.input}
            mode='outlined'
            label="Password again"
            value={mail}
            onChangeText={mail => setMail(mail)}
          />
          <TextInputMask
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY'
            }}
            value={mail}
            onChangeText={mail => setMail(mail)}
            style={styles.input}
            placeholder='DD/MM/YYYY'
          />

          
            <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
            <View style={{ flexDirection: 'row',alignItems: 'center',
                margin:10,marginLeft:32}}>
              <View style={{ flexDirection: 'row', }}>
                <RadioButton value="first" />
                <Text style={{marginTop:8,fontSize:15}}>Male</Text>
              </View>
              <View style={{ flexDirection: 'row',marginLeft:70}}>
                <RadioButton value="second" />
                <Text style={{marginTop:8,fontSize:15}}>Female</Text>
              </View>
              </View>
            </RadioButton.Group>
            <View>
    <Checkbox.Item label="Item" status="checked" />
  </View>
          </View>
       
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate('Main')}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FF6EA1' },
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
  buttonContainer: { margin: 10, justifyContent: 'flex-end' },
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
  header: { color: "white", fontSize: 24, fontWeight: 'bold', alignSelf: 'center', margin: 10 },
});

export default Signup;
