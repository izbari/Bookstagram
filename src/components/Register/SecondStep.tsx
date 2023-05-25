import React, {useState} from 'react';
import {Dimensions, Text, TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {Colors} from '../../resources/constants/Colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import tw from 'twrnc';
import RadioButtonGroup from '../Common/RadioButtonGroup';
const {width} = Dimensions.get('window');
interface ISecondStepProps {
  onNextStepPress: () => void;
  setFormData: (data: any) => void;
  formData: any;
}
enum GenderTypes {
  'male' = 'male',
  'female' = 'female',
}
const Genders = [
  {label: 'Male', value: GenderTypes.male},
  {label: 'Female', value: GenderTypes.female},
];
export const SecondStep: React.FunctionComponent<ISecondStepProps> = ({
  onNextStepPress,
  setFormData,
  formData,
}) => {
  const [focus, setFocus] = useState(false);
  const [open, setOpen] = useState(false);
  const disabled = !formData.gender || !formData.birth;
  const onConfirm = date => {
    setOpen(false);
    setFormData(prev => ({
      ...prev,
      birth: moment(date),
    }));
  };
  const onCancel = () => {
    setOpen(false);
  };
  const onOpen = () => {
    setOpen(true);
    setFocus(true);
  };
  const onGenderChanged = (gender: GenderTypes) => {
    setFormData(prev => ({...prev, gender}));
  };
  return (
    <KeyboardAwareScrollView contentContainerStyle={tw`grow`} enableOnAndroid>
      <Text style={{marginVertical: 10, textAlign: 'center', marginBottom: 40}}>
        Please enter birth of date and gender
      </Text>
      <TouchableOpacity
        style={tw`bg-[#ededed] border-gray-300 border rounded-md h-14 justify-center pl-4 mb-8`}
        onPress={onOpen}>
        <Text>
          {!formData.birth
            ? 'Birth of Date'
            : moment(formData.birth).format('DD.MM.YYYY')}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={open}
        date={new Date(formData.birth) ?? new Date()}
        mode="date"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      <RadioButtonGroup
        onChange={onGenderChanged}
        options={Genders}
        value={formData.gender}
      />

      <TouchableOpacity
        disabled={disabled}
        style={tw` h-12 bg-[${
          disabled ? Colors.lightPurple : Colors.darkPurple
        }] rounded-md justify-center mt-8`}
        onPress={onNextStepPress}>
        <Text style={tw`text-white text-center font-bold text-lg`}>Next</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};
