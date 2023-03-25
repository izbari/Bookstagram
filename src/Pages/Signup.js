import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {Text, ProgressBar} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import FirstStep from '../components/Signup/FirstStep';
import SecondStep from '../components/Signup/SecondStep';
import ThirdStep from '../components/Signup/ThirdStep';
import {createUser} from '../controllers/authController';
import colors from '../constants/colors';
//main methods
const STEP_LENGTH = 3;
const PROGRESS_LENGTH = STEP_LENGTH + 1;

function Signup(props) {
  //States ,effects, vars
  const dispatch = useDispatch();
  const [step, setStep] = React.useState(1);
  const [progressValue, setProgressValue] = React.useState(0);
  const [loading, setLoading] = useState(false);
  React.useEffect(() => {
    const timeout = setTimeout(
      () => setProgressValue(1 / PROGRESS_LENGTH),
      500,
    );
    return () => clearTimeout(timeout);
  }, []);

  const [formData, setFormData] = useState({
    email: props.route.params.email,
    password: '',
    passwordAgain: '',
    name: '',
    lastName: '',
    birth: null,
    gender: '',
    imageUrl: '',
    fallowers: ['initial'],
    fallowing: ['initial'],
    books: ['initial'],
    terms: false,
  });
  console.log(step, progressValue);
  const onNextStepPress = useCallback(() => {
    if (step === 3) {
      setProgressValue(1);
      return onRegister(formData);
    }
    const currStep = stepHandler(step, 1);
    setProgressValue(currStep / PROGRESS_LENGTH);
    setStep(currStep);
  }, [step, formData]);
  const stepHandler = (step, val) => {
    return Math.min(Math.max(step + val, 1), STEP_LENGTH);
  };

  const onPreviousStepPress = useCallback(() => {
    if (step === 1) return props.navigation.navigate('Login');
    const currStep = stepHandler(step, -1);
    setProgressValue(currStep / PROGRESS_LENGTH);
    setStep(currStep);
  }, [step]);
  console.log('formData', formData);
  const onRegister = async formData => {
    const newUser = {
      ...formData,
      birth: new Date(formData.birth).toISOString(),
      imageUrl: `https://ui-avatars.com/api/?name=${formData.name}-${formData.lastName}&background=random`,
      fallowers: ['initial'],
      fallowing: ['initial'],
      books: ['initial'],
    };
    setLoading(true);
    await createUser(newUser, props);
    setLoading(false);
  };
  const StepSelector = useCallback(
    ({step, formData, onNextStepPress, setFormData}) => {
      switch (step) {
        case 1:
          return (
            <FirstStep
              onNextStepPress={onNextStepPress}
              setFormData={setFormData}
              formData={formData}
            />
          );
        case 2:
          return (
            <SecondStep
              onNextStepPress={onNextStepPress}
              setFormData={setFormData}
              formData={formData}
            />
          );
        case 3:
          return (
            <ThirdStep
              onNextStepPress={onNextStepPress}
              setFormData={setFormData}
              formData={formData}
              loading={loading}
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
            {
              <TouchableOpacity onPress={onNextStepPress}>
                <Text
                  variant="bodyLarge"
                  style={{color: colors.lightPurple, fontWeight: 'bold'}}>
                  {step !== 3 ? 'Next' : 'Sign up'}
                </Text>
              </TouchableOpacity>
            }
          </View>
          <ProgressBar
            progress={progressValue}
            color={colors.lightPurple}
            style={{transform: [{scaleX: 0.8}]}}
          />

          <View style={{margin: 20, marginTop: 40}}>
            <StepSelector
              step={step}
              onNextStepPress={onNextStepPress}
              setFormData={setFormData}
              formData={formData}
            />
          </View>
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
