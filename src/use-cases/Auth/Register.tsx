import React, {useState, useCallback} from 'react';
import {SafeAreaView, View, TouchableOpacity, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import {createUser} from '../../infrastructure/Controllers/AuthController';
import {IUser} from '../../infrastructure/Redux/Slices/UserSlice';
import {FirstStep} from '../../components/Register/FirstStep';
import {SecondStep} from '../../components/Register/SecondStep';
import {ThirdStep} from '../../components/Register/ThirdStep';
import {Colors} from '../../resources/constants/Colors';
import {ProgressBar} from '../../components/Common/ProgressBar';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import tw from 'twrnc';
//main methods
const STEP_LENGTH = 3;
const PROGRESS_LENGTH = STEP_LENGTH + 1;
type IRegisterProps = IWithNavigation<RouteNames.register>;

export const Register: React.FunctionComponent<IRegisterProps> = props => {
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
    email: props.route?.params?.email,
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
  const onRegister = React.useCallback(
    async (formData: IUser) => {
      const newUser = {
        ...formData,
        birth: formData?.birth ? new Date(formData?.birth).toISOString() : null,
        imageUrl: `https://ui-avatars.com/api/?name=${formData.name}-${formData.lastName}&background=random`,
        fallowers: ['initial'],
        fallowing: ['initial'],
        books: ['initial'],
      };
      setLoading(true);
      await createUser(newUser);
      setLoading(false);
    },
    [props],
  );
  const onNextStepPress = useCallback(() => {
    if (step === 3) {
      setProgressValue(1);
      return onRegister(formData);
    }
    const currStep = stepHandler(step, 1);
    setProgressValue(currStep / PROGRESS_LENGTH);
    setStep(currStep);
  }, [step, onRegister, formData]);
  const stepHandler = (step: number, val: number) => {
    return Math.min(Math.max(step + val, 1), STEP_LENGTH);
  };

  const onPreviousStepPress = useCallback(() => {
    if (step === 1) {
      return props.navigation.navigate(RouteNames.login);
    }
    const currStep = stepHandler(step, -1);
    setProgressValue(currStep / PROGRESS_LENGTH);
    setStep(currStep);
  }, [props.navigation, step]);
  console.log('formData', formData);

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
    [loading],
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <KeyboardAwareScrollView
        contentContainerStyle={tw`grow p-4`}
        enableOnAndroid>
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
            <Text style={{color: 'gray'}}>Back</Text>
          </TouchableOpacity>
          {
            <TouchableOpacity onPress={onNextStepPress}>
              <Text style={{color: Colors.lightPurple, fontWeight: 'bold'}}>
                {step !== 3 ? 'Next' : 'Sign up'}
              </Text>
            </TouchableOpacity>
          }
        </View>
        <ProgressBar progress={progressValue} barColor={Colors.darkPurple} />

        <View style={{margin: 20, marginTop: 40}}>
          <StepSelector
            step={step}
            onNextStepPress={onNextStepPress}
            setFormData={setFormData}
            formData={formData}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
