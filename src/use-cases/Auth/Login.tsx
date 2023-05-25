import * as React from 'react';
import {
  SafeAreaView,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import {CustomButton} from '../../components/Common/CustomButton';
import {Colors} from '../../resources/constants/Colors';
import tw from 'twrnc';
import {WelcomeAnimation} from '../../components/Landing/WelcomeAnimation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  checkEmailExist,
  userLogin,
} from '../../infrastructure/Controllers/AuthController';
import Icon from 'react-native-vector-icons/Ionicons';
type ILoginProps = IWithNavigation<RouteNames.login>;

const {width} = Dimensions.get('window');
export const Login: React.FunctionComponent<ILoginProps> = props => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailChecked, setEmailChecked] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [secret, setSecret] = React.useState(true);
  const [focus, setFocus] = React.useState(false);
  const disabled = !emailChecked ? !(email.length > 0) : !(password.length > 0);
  const onLogin = async () => {
    try {
      setLoading(true);

      if (emailChecked) {
        const resp = await userLogin(email, password);
        console.warn('resp', resp);
        if (resp) {
          resetStates();
        }
      }
      const isExist = await checkEmailExist(email);
      if (!isExist.length) {
        props.navigation.navigate(RouteNames.register, {email: email});
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
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAwareScrollView
        enableOnAndroid
        contentContainerStyle={tw`grow bg-white`}>
        <View style={styles.lottieContainer}>
          <WelcomeAnimation />
        </View>

        <View style={tw`w-10/12 self-center justify-between pb-8`}>
          {!emailChecked && (
            <Text style={tw`text-2xl mb-4 text-[${Colors.lightPurple}]`}>
              Welcome to Bookstagram
            </Text>
          )}

          {emailChecked ? (
            <>
              <View style={tw`justify-between items-center`}>
                <Text style={tw`text-black text-lg mb-2`}> {email}</Text>
                <TouchableOpacity onPress={() => setEmailChecked(false)}>
                  <Text style={tw`text-[${Colors.darkPurple}] font-bold mb-8`}>
                    Change Email
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TextInput
                  secureTextEntry={secret}
                  autoCorrect={false}
                  placeholderTextColor="grey"
                  style={tw`pl-4 h-16 rounded-lg border-2  ${
                    focus ? 'border-purple-300 ' : 'border-gray-300'
                  } bg-gray-200`}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  scrollEnabled={false}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                />
                {password.length > 0 ? (
                  <CustomButton
                    style={tw`absolute right-4 top-4.5`}
                    onPress={() => {
                      setSecret(prev => !prev);
                    }}>
                    <Icon
                      name={secret ? 'eye' : 'eye-off'}
                      size={25}
                      color={focus ? Colors.lightPurple : 'grey'}
                    />
                  </CustomButton>
                ) : null}
              </View>
            </>
          ) : (
            <View>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="grey"
                style={tw`pl-4 h-16 rounded-lg border-2  ${
                  focus ? 'border-purple-300 ' : 'border-gray-300'
                } bg-gray-200`}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                selectionColor={Colors.lightPrimaryColor}
                scrollEnabled={false}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              {email.length > 0 ? (
                <CustomButton
                  style={tw`absolute right-4 top-4.5`}
                  onPress={() => {
                    setEmail('');
                  }}>
                  <Icon name="close-outline" color={'grey'} size={25} />
                </CustomButton>
              ) : null}
            </View>
          )}
          <CustomButton
            disabled={disabled}
            style={tw`w-full h-12 mt-8 bg-[${
              disabled ? Colors.lightPurple : Colors.darkPurple
            }] rounded-lg items-center justify-center `}
            onPress={onLogin}>
            {loading ? (
              <ActivityIndicator color={'#fff'} />
            ) : (
              <Text style={tw`text-white font-bold text-lg`}>
                {emailChecked ? 'Log in' : 'Next'}
              </Text>
            )}
          </CustomButton>
        </View>
      </KeyboardAwareScrollView>
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
