import React, {useState} from 'react';
import {TextInput} from 'react-native-element-textinput';
import {ScrollView, StyleSheet, View, Dimensions} from 'react-native';
import {Text, Button, Checkbox} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import TermsPopup from '../TermsPolicyModal';
const {width} = Dimensions.get('window');
export default function SecondStep({onNextStepPress, setFormData}) {
  const [visible, setVisible] = useState(false);
  const [focus, setFocus] = useState(false);
  const [focusForAgain, setFocusForAgain] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');

  const [secret, setSecret] = useState(true);
  const [secretAgain, setSecretAgain] = useState(true);

  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const disabled =
    !password.length > 0 ||
    !passwordAgain.length > 0 ||
    password !== passwordAgain;
  const onRegister = () => {
    console.log('register');
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
          borderColor: focus ? '#A39ACF' : '#ededed',
          backgroundColor: '#ededed',
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
        onChangeText={setPassword}
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
          marginBottom: 40,
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
        onChangeText={setPasswordAgain}
      />
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Checkbox.Item
          color={'white'}
          labelStyle={{fontSize: 12, fontStyle: 'italic'}}
          style={{fontSize: 12}}
          status={checked ? 'checked' : 'unchecked'}
          label={'I accept the Terms in the License Agreement.'}
          position="leading"
          onPress={() => {
            if (checked) {
              setChecked(false);
            } else {
              setVisible(true);
            }
          }}
        />
      </View>
      {visible && (
        <TermsPopup visible={visible} hideModal={() => setVisible(false)} />
      )}

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
          {backgroundColor: disabled ? '#8B7FC5' : '#A39ACF'},
        ]}
        loading={loading}
        onPress={onRegister}>
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
