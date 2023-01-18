import * as React from 'react';
import {
  SafeAreaView,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
} from 'react-native';

import {checkEmailExist, userLogin} from '../controllers/authController';
import Welcome from '../components/Yoga';
import {TextInput} from 'react-native-element-textinput';
import Icon from 'react-native-vector-icons/Ionicons';
import {ActivityIndicator, Button, Text} from 'react-native-paper';
const {width} = Dimensions.get('window');
function Login(props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailChecked, setEmailChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [secret, setSecret] = React.useState(true);
  const [focus, setFocus] = React.useState(false);
  const disabled = !emailChecked ? !email.length > 0 : !password.length > 0;
  const onLogin = async () => {
    try {
      setLoading(true);

      if (emailChecked) {
        const resp = await userLogin(email, password);
        console.warn('resp', resp);
        if (resp) {
          resetStates();
          return props.navigation.navigate('AuthLoading', {
            from: 'Login',
          });
        }
      }
      const isExist = await checkEmailExist(email);
      if (!isExist.length > 0) {
        props.navigation.navigate('Signup', {email: email});
        resetStates();
      } else {
        setEmailChecked(true);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  const resetStates = () => {
    setEmailChecked(false);
    setPassword('');
    setEmail('');
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, backgroundColor: '#fff'}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1, paddingBottom: 40}}>
          <View style={styles.lottieContainer}>
            <Welcome />
          </View>

          <View
            style={{
              width: width * 0.8,
              alignSelf: 'center',
              justifyContent: 'space-between',
              paddingVertical: 40,
            }}>
            {!emailChecked && (
              <Text
                variant="titleLarge"
                style={{marginBottom: 20, color: '#8B7FC5'}}>
                Welcome to Bookstagram
              </Text>
            )}

            {emailChecked ? (
              <>
                <View
                  style={{
                    alignItems: 'center',
                    marginBottom: 35,
                    height: 50,
                    justifyContent: 'space-between',
                  }}>
                  <Text variant="bodyLarge"> {email}</Text>
                  <TouchableOpacity
                    onPress={() => setEmailChecked(false)}
                    labelStyle={{color: 'white'}}>
                    <Text
                      variant="labelLarge"
                      style={{color: '#8B7FC5', fontWeight: 'bold'}}>
                      Change Email
                    </Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  renderRightIcon={() =>
                    password.length > 0 ? (
                      <Icon
                        name={secret ? 'eye' : 'eye-off'}
                        size={25}
                        color={focus ? '#A39ACF' : 'grey'}
                        onPress={() => {
                          setSecret(prev => !prev);
                        }}
                      />
                    ) : null
                  }
                  secureTextEntry={secret}
                  autoCorrect={false}
                  placeholderTextColor="grey"
                  style={{
                    marginBottom: 40,
                    paddingHorizontal: 15,
                    borderRadius: 10,
                    height: 60,
                    borderWidth: 2,
                    borderColor: focus ? '#A39ACF' : '#ededed',
                    backgroundColor: '#ededed',
                  }}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  focusColor="#A39ACF"
                  selectionColor="#A39ACF"
                  inputStyle={{
                    color: 'grey',
                  }}
                  scrollEnabled={false}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                />
              </>
            ) : (
              <TextInput
                autoCapitalize='none'
                renderRightIcon={() =>
                  email.length > 0 ? (
                    <Icon
                      name="close-outline"
                      size={25}
                      color={'grey'}
                      onPress={() => {
                        setEmail('');
                      }}
                    />
                  ) : null
                }
                autoCorrect={false}
                placeholderTextColor="grey"
                style={{
                  marginBottom: 40,
                  paddingHorizontal: 15,
                  borderRadius: 10,
                  height: 60,
                  borderWidth: 2,
                  borderColor: focus ? '#A39ACF' : '#ededed',
                  backgroundColor: '#ededed',
                }}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                focusColor="#A39ACF"
                selectionColor="#A39ACF"
                inputStyle={{
                  color: 'grey',
                }}
                scrollEnabled={false}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
            )}
            <Button
              mode="contained"
              compact
              contentStyle={{height: 50}}
              disabled={disabled}
              style={[
                styles.button,
                {backgroundColor: disabled ? '#A39ACF' : '#8B7FC5'},
              ]}
              loading={loading}
              onPress={onLogin}>
              {loading ? undefined : (
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    letterSpacing: 1,
                    fontSize: 18,
                    textAlign: 'center',
                  }}>
                  Log in
                </Text>
              )}
            </Button>
            {/* <Text style={{textAlign: 'center', marginTop: 10}}>
            <Text>{"Don't have an account?"} </Text>
            <Text
              onPress={() => props.navigation.navigate('Signup')}
              variant="labelLarge"
              style={{
                color: '#A39ACF',
                textDecorationLine: 'underline',
                fontWeight: 'bold',
              }}>
              {'Sign up'}
            </Text>
          </Text> */}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#FF6EA1'},
  lottieContainer: {
    marginTop: 40,
    width: '90%',
    height: '40%',
    alignSelf: 'center',
  },

  button: {
    width: width * 0.8,
    borderRadius: 10,
    borderColor: 'white',
    height: 50,
    backgroundColor: '#A39ACF',
  },
  buttonText: {
    alignSelf: 'center',
    color: '#FF6EA1',
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    alignSelf: 'center',
    borderRadius: 15,
    borderColor: 'white',
    width: width * 0.8,
    borderWidth: 1,
    height: 50,
    margin: 10,
  },
});

export default Login;
