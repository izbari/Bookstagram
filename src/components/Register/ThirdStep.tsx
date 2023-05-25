import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {WebView} from 'react-native-webview';
import {Colors} from '../../resources/constants/Colors';
import {terms} from '../../resources/constants/Terms';
import Modal from 'react-native-modal';
import {Checkbox} from '../Common/Checkbox';
import tw from 'twrnc';
const {width, height} = Dimensions.get('window');
interface IThirdStepProps {
  onNextStepPress: () => void;
  setFormData: (data: any) => void;
  formData: any;
  loading: boolean;
}
export const ThirdStep: React.FunctionComponent<IThirdStepProps> = ({
  setFormData,
  formData,
  loading,
  onNextStepPress,
}) => {
  const [visible, setVisible] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [passAgainFocus, setPassAgainFocus] = useState(false);

  const [secret, setSecret] = useState(false);
  const [secretAgain, setSecretAgain] = useState(true);

  const password = formData.password;
  const passwordAgain = formData.passwordAgain;

  const disabled = !password.length || password !== passwordAgain;

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
      <Text style={{marginVertical: 10, textAlign: 'center', marginBottom: 40}}>
        Set your password
      </Text>
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
        style={tw`mb-10 pl-4 rounded-md h-14 bg-[#ededed] border ${
          passFocus ? `border-[${Colors.lightPurple}]` : 'border-gray-300'
        }`}
        onFocus={() => setPassFocus(true)}
        onBlur={() => setPassFocus(false)}
        selectionColor={Colors.lightPurple}
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
              color={focusForAgain ? Colors.lightPurple : 'grey'}
              onPress={() => {
                setSecretAgain(prev => !prev);
              }}
            />
          ) : null
        }
        secureTextEntry={secretAgain}
        autoCorrect={false}
        placeholderTextColor="grey"
        style={tw`mb-10 pl-4 rounded-md h-14 bg-[#ededed] border ${
          passAgainFocus ? `border-[${Colors.lightPurple}]` : 'border-gray-300'
        }`}
        onFocus={() => setPassAgainFocus(true)}
        onBlur={() => setPassAgainFocus(false)}
        selectionColor={Colors.lightPurple}
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
          alignItems: 'center',
          flexDirection: 'row',
          marginVertical: 20,
          width,
        }}>
        <Checkbox checked={formData.terms} onPress={onCheckboxPress} />
        <Text numberOfLines={1} adjustsFontSizeToFit style={tw`pl-2`}>
          I accept the Terms in the License Agreement.
        </Text>
      </View>

      <TouchableOpacity
        disabled={disabled}
        style={tw` h-12 bg-[${
          disabled ? Colors.lightPurple : Colors.darkPurple
        }] rounded-md justify-center`}
        onPress={onNextStepPress}>
        {loading ? (
          <ActivityIndicator />
        ) : (
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
      </TouchableOpacity>
      <Modal
        deviceHeight={height}
        deviceWidth={width}
        isVisible={visible}
        coverScreen
        style={tw`rounded-lg m-4`}
        onDismiss={() => setVisible(false)}>
        <View style={tw`flex-1 my-16 rounded-lg`}>
          <TouchableOpacity
            style={tw`absolute top-0 right-0 p-4 z-10`}
            hitSlop={{top: 10, bottom: 10, right: 10, left: 10}}
            onPress={() => setVisible(false)}>
            <Icon name="close-outline" size={24} />
          </TouchableOpacity>
          <WebView
            originWhitelist={['*']}
            scrollEventThrottle={400}
            showsVerticalScrollIndicator={false}
            startInLoadingState={false}
            scalesPageToFit={true}
            source={{
              html: `
                  <head>
                    <meta content="width=width, initial-scale=1 maximum-scale=0.9" name="viewport"></meta>
                  </head>
                  <body style="padding: 15 !important; background-image" size: ${terms}`,
            }}
            style={tw`rounded-t-lg`}
          />
          <TouchableOpacity
            style={tw`h-12 bg-[${Colors.lightPurple}] rounded-b-lg justify-center items-center`}
            onPress={onAcceptTermPress}>
            <Text style={tw`text-white font-extrabold`}>
              Accept Terms and Policies
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};
