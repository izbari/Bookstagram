import React, {useState} from 'react';
import {TextInput} from 'react-native-element-textinput';
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Text, Button, Checkbox, Modal, Portal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {WebView} from 'react-native-webview';
import terms from '../../utils/terms';
const {width} = Dimensions.get('window');
export default function ThirdStep({
  setFormData,
  formData,
  loading,
  onNextStepPress
}) {
  const [visible, setVisible] = useState(false);
  const [focus, setFocus] = useState(false);
  const [focusForAgain, setFocusForAgain] = useState(false);

  const [secret, setSecret] = useState(true);
  const [secretAgain, setSecretAgain] = useState(true);

  const password = formData.password;
  const passwordAgain = formData.passwordAgain;

  const disabled =
    !password.length > 0 ||
    !passwordAgain.length > 0 ||
    password !== passwordAgain;

  const onAcceptTermPress = () => {
    setVisible(false);
    setFormData(prev => ({...prev, terms: true}));
  };

  const onCheckboxPress = () => {
    if (formData.terms) {
      setFormData(prev => ({...prev, terms: false}));
    } else {
      setVisible(true);
    }
  };

  return (
    <ScrollView>
      <Text
        variant="headlineMedium"
        style={{marginVertical: 10, textAlign: 'center', marginBottom: 40}}>
        Set your password
      </Text>
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
          backgroundColor: '#ededed',
          borderColor: focus ? '#A39ACF' : '#ededed',
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        selectionColor="#A39ACF"
        inputStyle={{
          color: 'grey',
        }}
        scrollEnabled={false}
        placeholder="Password"
        value={password}
        onChangeText={password =>
          setFormData(prev => ({...prev, password: password}))
        }
      />
      <TextInput
        renderRightIcon={() =>
          passwordAgain.length > 0 ? (
            <Icon
              name={secretAgain ? 'eye' : 'eye-off'}
              size={25}
              color={focusForAgain ? '#A39ACF' : 'grey'}
              onPress={() => {
                setSecretAgain(prev => !prev);
              }}
            />
          ) : null
        }
        secureTextEntry={secretAgain}
        autoCorrect={false}
        placeholderTextColor="grey"
        style={{
          paddingHorizontal: 15,
          borderRadius: 10,
          height: 60,
          borderWidth: 2,
          borderColor: focusForAgain ? '#A39ACF' : '#ededed',
          backgroundColor: '#ededed',
        }}
        onFocus={() => setFocusForAgain(true)}
        onBlur={() => setFocusForAgain(false)}
        selectionColor="#A39ACF"
        inputStyle={{
          color: 'grey',
        }}
        scrollEnabled={false}
        placeholder="Password Again"
        value={passwordAgain}
        onChangeText={passwordAgain =>
          setFormData(prev => ({...prev, passwordAgain: passwordAgain}))
        }
      />
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 20,
          width,
        }}>
        <Checkbox.Item
          color={'#8B7FC5'}
          labelStyle={{fontSize: 12, fontStyle: 'italic'}}
          style={{fontSize: 12}}
          status={formData.terms ? 'checked' : 'unchecked'}
          label={'I accept the Terms in the License Agreement.'}
          position="leading"
          onPress={onCheckboxPress}
        />
      </View>

      <Button
        mode="contained"
        compact
        contentStyle={{height: 50}}
        disabled={disabled}
        style={[
          {
            width: width * 0.8,
            borderRadius: 10,
            borderColor: 'white',
            height: 50,
            backgroundColor: '#8B7FC5',
          },
          {backgroundColor: disabled ? '#A39ACF' : '#8B7FC5'},
        ]}
        loading={loading}
        onPress={onNextStepPress}>
        {loading ? undefined : (
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              letterSpacing: 1,
              fontSize: 18,
              textAlign: 'center',
            }}>
            Sign up
          </Text>
        )}
      </Button>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={{
            backgroundColor: 'white',
            flex: 1,
            margin: 15,
            borderRadius: 10,
          }}>
          <View style={{flex: 1, padding: 20}}>
            <TouchableOpacity
              hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}
              style={{position: 'absolute', right: 15, top: 15, zIndex: 99}}
              onPress={() => setVisible(false)}>
              <Icon name="close-outline" size={24} />
            </TouchableOpacity>
            <WebView
              originWhitelist={['*']}
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
            mode="outlined"
            compact
            style={{
              borderRadius: 0,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              backgroundColor: '#8B7FC5',
            }}
            labelStyle={{
              color: '#fff',
              fontWeight: 'bold',
              letterSpacing: 1,
              textAlign: 'center',
            }}
            onPress={onAcceptTermPress}>
            Accept Terms and Policies
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
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
