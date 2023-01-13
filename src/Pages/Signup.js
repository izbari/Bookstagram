import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  RadioButton,
  Checkbox,
  Portal,
  Text,
  ProgressBar,
  Modal,
  Button,
} from 'react-native-paper';
import {TextInputMask} from 'react-native-masked-text';
import moment from 'moment';
import AuthController from '../controllers/authController';
import terms from '../utils/terms';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextInput} from 'react-native-element-textinput';
import FirstStep from '../components/Signup/FirstStep';
import SecondStep from '../components/Signup/SecondStep';
import ThirdStep from '../components/Signup/ThirdStep';

//main methods
const STEP_LENGTH = 3;

function Signup(props) {
  //States ,effects, vars
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);
  const [bottom, setBottom] = React.useState(true);
  // const hideModal = () => {
  //   setVisible(false);
  //   setBottom(true);
  //   setChecked(true);
  // };
  const [formData, setFormData] = useState({
    email: props.route.params.email,
    password: '',
    passwordAgain: '',
    name: '',
    lastName: '',
    birth: '',
    gender: '',
    imageUrl: '',
    fallowers: ['initial'],
    fallowing: ['initial'],
    books: ['initial'],
    terms: false,
  });
  const signUpHandler = async () => {
    const imgUrl = `https://ui-avatars.com/api/?name=${name}-${lastName}&background=random`;
    // const newUser = {
    //   email: email,
    //   password: password,
    //   passwordAgain: passwordAgain,
    //   name: name,
    //   lastName: lastName,
    //   birth: birth,
    //   gender: gender,
    //   imageUrl: `https://ui-avatars.com/api/?name=${name}-${lastName}&background=random`,
    //   fallowers: ['initial'],
    //   fallowing: ['initial'],
    //   books: ['initial'],
    //   terms: checked,
    // };

    await AuthController.createUser(newUser, props);
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height;
  };
  // const TermsPopup = () => {
  //   return (
  //     <Portal>
  //       <Modal
  //         visible={visible}
  //         onDismiss={hideModal}
  //         contentContainerStyle={styles.containerStyle}>
  //         <View style={{flex: 1, padding: 20}}>
  //           <WebView
  //             originWhitelist={['*']}
  //             onScroll={({nativeEvent}) => {
  //               if (isCloseToBottom(nativeEvent)) {
  //                 setBottom(false);
  //               }
  //             }}
  //             scrollEventThrottle={400}
  //             showsVerticalScrollIndicator={false}
  //             startInLoadingState={false}
  //             scalesPageToFit={false}
  //             source={{
  //               html: `
  //                 <head>
  //                   <meta content="width=width, initial-scale=1, maximum-scale=0.8" name="viewport"></meta>
  //                 </head>
  //                 <body style="background-image" size: ${terms}`,
  //             }}
  //             style={{flex: 1, padding: 20}}
  //           />
  //         </View>
  //         <Button
  //           title="Accept Terms and Policies"
  //           style={{marginTop: 30}}
  //           onPress={hideModal}
  //           disabled={bottom}></Button>
  //       </Modal>
  //     </Portal>
  //   );
  // };

  const stepHandler = (step, val) => {
    return Math.min(Math.max(step + val, 0), STEP_LENGTH);
  };
  const [step, setStep] = React.useState(0);
  const [progressValue, setProgressValue] = React.useState(0);
  const onNextStepPress = useCallback(() => {
    const currStep = stepHandler(step, 1);
    setProgressValue(currStep / STEP_LENGTH);
    setStep(currStep);
  }, [step]);

  console.warn('progressValue : ', progressValue);
  const onPreviousStepPress = useCallback(() => {
    if (step === 0) return props.navigation.navigate('Login');
    const currStep = stepHandler(step, -1);
    setProgressValue(currStep / STEP_LENGTH);
    setStep(currStep);
  }, [step]);
  console.log('formData : ', formData);
  const StepSelector = useCallback(
    ({step}) => {
      switch (step) {
        case 0:
          return (
            <FirstStep
              onNextStepPress={onNextStepPress}
              setFormData={setFormData}
            />
          );
        case 1:
          return (
            <SecondStep
              onNextStepPress={onNextStepPress}
              setFormData={setFormData}
            />
          );
        case 2:
          return (
            <ThirdStep
              onNextStepPress={onNextStepPress}
              setFormData={setFormData}
            />
          );
        default:
          return null;
      }
    },
    [step],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView contentContainerStyle={{flexGrow: 1, padding: 20}}>
        <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 20,
            }}>
            <TouchableOpacity
              onPress={onPreviousStepPress}
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name={'chevron-back-outline'} size={20} color="gray" />
              <Text variant="labelLarge" style={{color: 'gray'}}>
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNextStepPress}>
              <Text
                variant="bodyLarge"
                style={{color: '#A39ACF', fontWeight: 'bold'}}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
          <ProgressBar
            progress={progressValue}
            color={'#A39ACF'}
            style={{marginHorizontal: 40}}
          />

          {/* {visible && <TermsPopup />} */}
          <View style={{margin: 20, marginTop: 40}}>
            <StepSelector
              step={step}
              onNextStepPress={onNextStepPress}
              setFormData={setFormData}
            />
          </View>
          {/* <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={signUpHandler}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => props.navigation.navigate('Login')}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View> */}
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
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

export default Signup;
