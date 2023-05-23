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
  Text,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import {CustomButton} from '../../components/Common/CustomButton';
import {Colors} from '../../resources/constants/Colors';
import tw from 'twrnc';
import {WelcomeAnimation} from '../../components/Landing/WelcomeAnimation';
type ILoginProps = IWithNavigation<RouteNames.login>;

const {width} = Dimensions.get('window');
export const Login: React.FunctionComponent<ILoginProps> = props => {
  const [email, setEmail] = React.useState('fuckkkk@gmail.com');
  const [password, setPassword] = React.useState('');
  const [emailChecked, setEmailChecked] = React.useState(true);
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
            <WelcomeAnimation />
          </View>

          <View
            style={{
              width: width * 0.8,
              alignSelf: 'center',
              justifyContent: 'space-between',
              paddingBottom: 40,
            }}>
            {!emailChecked && (
              <Text style={tw`text-2xl mb-4 text-[${Colors.lightPurple}]`}>
                Welcome to Bookstagram
              </Text>
            )}

            {emailChecked ? (
              <>
                <View style={tw` justify-between items-center`}>
                  <Text style={tw` text-black text-lg mb-2`}> {email}</Text>
                  <TouchableOpacity onPress={() => setEmailChecked(false)}>
                    <Text
                      style={tw`text-[${Colors.darkPurple}] font-bold mb-8`}>
                      Change Email
                    </Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  // renderRightIcon={() =>
                  //   password.length > 0 ? (
                  //     <Icon
                  //       name={secret ? 'eye' : 'eye-off'}
                  //       size={25}
                  //       color={focus ? Colors.lightPurple : 'grey'}
                  //       onPress={() => {
                  //         setSecret(prev => !prev);
                  //       }}
                  //     />
                  //   ) : null
                  // }
                  secureTextEntry={secret}
                  autoCorrect={false}
                  placeholderTextColor="grey"
                  style={tw`pl-4 h-16 rounded-lg border-2  ${
                    focus ? 'border-purple-300 ' : 'border-gray-300'
                  } bg-gray-200`}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  focusColor={Colors.red}
                  selectionColor={Colors.secondaryColor}
                  inputStyle={tw`text-gray-700`}
                  scrollEnabled={false}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                />
              </>
            ) : (
              <TextInput
                autoCapitalize="none"
                // renderRightIcon={() =>
                //   email.length > 0 ? (
                //     <Icon
                //       name="close-outline"
                //       size={25}
                //       color={'grey'}
                //       onPress={() => {
                //         setEmail('');
                //       }}
                //     />
                //   ) : null
                // }
                autoCorrect={false}
                placeholderTextColor="grey"
                style={tw`pl-4 h-16 text-lg text-gray-500 rounded-lg border-2 ${
                  focus ? 'border-purple-300 ' : 'border-gray-300'
                } bg-gray-200`}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                focusColor={Colors.darkGray}
                selectionColor={Colors.lightPrimaryColor}
                scrollEnabled={false}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
            )}
            <CustomButton
              disabled={disabled}
              style={tw`w-full h-13 mt-8 bg-[${
                disabled ? Colors.lightPurple : Colors.darkPurple
              }] rounded-lg items-center justify-center `}
              onPress={onLogin}>
              {loading ? undefined : (
                <Text style={tw`text-white font-bold text-lg`}>Log in</Text>
              )}
            </CustomButton>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#FF6EA1'},
  lottieContainer: {
    marginTop: 40,
    width: '90%',
    height: '40%',
    alignSelf: 'center',
    marginBottom: 40,
  },

  button: {
    width: width * 0.8,
    borderRadius: 10,
    borderColor: 'white',
    height: 50,
    backgroundColor: Colors.darkPurple,
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
