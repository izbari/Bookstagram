import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import authController from '../controllers/authController';
import {TextInput} from 'react-native-paper';
import Welcome from '../components/Yoga';
function App(props) {

  const [email, seteMail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [secret, setSecret] = React.useState(true);
  
  

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.header}>WELCOME BACK !</Text>

      <View style={styles.lottieContainer}>
        <Welcome />
      </View>

    <View style={{flex:2.5}}>
    <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          selectionColor='#FF6EA1'  
                  theme={{ colors: { placeholder: 'black', text: 'black', primary: "black",underlineColor:'transparent',background : '#003489'}}}

          mode="outlined"
          label="Email"
          value={email}
          
        
          underlineColor='transparent'
          editable= {true}
         
          onChangeText={email => seteMail(email)}
        />
        
        <TextInput
           value={password}
           mode="outlined"
           
           onChangeText={password => setPassword(password)}
           secureTextEntry={secret}
           
           label="Password"
           style={styles.input}
           theme={{ colors: { placeholder: 'black', text: 'black', primary: "black",underlineColor:'transparent',background : '#003489'}}}
           right={<TextInput.Icon 
             onPress={() => setSecret(!secret)}
           name="eye" color="grey" style={{marginTop:15}}/>}
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
                let ideklenmisuser = {...user};

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
    marginBottom:50,
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
  },
});

export default App;
