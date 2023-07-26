import React, {useState} from 'react';
import {
  ScrollView,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import tw from 'twrnc';
import {Colors} from '../../resources/constants/Colors';
const {width} = Dimensions.get('window');
interface IFirstStepProps {
  onNextStepPress: () => void;
  setFormData: (data: any) => void;
  formData: any;
}
export const FirstStep: React.FunctionComponent<IFirstStepProps> = ({
  onNextStepPress,
  setFormData,
  formData,
}) => {
  const [nameFocus, setNameFocus] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);
  const disabled = !formData.name.length || !formData.lastName.length;
  return (
    <ScrollView>
      <Text style={{marginVertical: 10, textAlign: 'center', marginBottom: 40}}>
        Please enter your name
      </Text>
      <TextInput
        autoCorrect={false}
        placeholderTextColor="grey"
        style={tw`mb-10 pl-4 rounded-md h-14 bg-[#ededed] border ${
          nameFocus ? `border-[${Colors.lightPurple}]` : 'border-gray-300'
        }`}
        onFocus={() => setNameFocus(true)}
        onBlur={() => setNameFocus(false)}
        selectionColor={Colors.lightPurple}
        scrollEnabled={false}
        placeholder="Name"
        value={formData.name}
        onChangeText={text => setFormData(prev => ({...prev, name: text}))}
      />
      <TextInput
        autoCorrect={false}
        placeholderTextColor="grey"
        style={tw`mb-10 pl-4 rounded-md h-14 bg-[#ededed] border ${
          lastNameFocus ? `border-[${Colors.lightPurple}]` : 'border-gray-300'
        }`}
        onFocus={() => setLastNameFocus(true)}
        onBlur={() => setLastNameFocus(false)}
        selectionColor={Colors.lightPurple}
        scrollEnabled={false}
        placeholder="Last name"
        value={formData.lastName}
        onChangeText={text => setFormData(prev => ({...prev, lastName: text}))}
      />
      {/* create below button with touchableopacity */}

      <TouchableOpacity
        disabled={disabled}
        style={tw` h-12 bg-[${
          disabled ? Colors.lightPurple : Colors.darkPurple
        }] rounded-md justify-center`}
        onPress={onNextStepPress}>
        <Text style={tw`text-white text-center font-bold text-lg`}>Next</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
