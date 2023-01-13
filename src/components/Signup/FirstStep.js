import React, {useState} from 'react';
import {TextInput} from 'react-native-element-textinput';
import {ScrollView, Dimensions} from 'react-native';
import {Text, Button} from 'react-native-paper';
import {memo} from 'react';
const {width} = Dimensions.get('window');
function FirstStep({onNextStepPress, setFormData, formData}) {
  const [focus2, setFocus2] = useState(false);
  const [focus, setFocus] = useState(false);
  return (
    <ScrollView>
      <Text
        variant="headlineMedium"
        style={{marginVertical: 10, textAlign: 'center', marginBottom: 40}}>
        Please enter your name
      </Text>
      <TextInput
        renderRightIcon={() => null}
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
        placeholder="Name"
        value={formData.name}
        onChangeText={text => setFormData(prev => ({...prev, name: text}))}
      />
      <TextInput
        renderRightIcon={() => null}
        autoCorrect={false}
        placeholderTextColor="grey"
        style={{
          marginBottom: 40,
          paddingHorizontal: 15,
          borderRadius: 10,
          height: 60,
          borderWidth: 2,
          borderColor: focus2 ? '#A39ACF' : '#ededed',
          backgroundColor: '#ededed',
        }}
        onFocus={() => setFocus2(true)}
        onBlur={() => setFocus2(false)}
        selectionColor="#A39ACF"
        inputStyle={{
          color: 'grey',
        }}
        scrollEnabled={false}
        placeholder="Last name"
        value={formData.lastName}
        onChangeText={text => setFormData(prev => ({...prev, lastName: text}))}
      />
      <Button
        mode="contained"
        compact
        contentStyle={{height: 50}}
        // disabled={disabled}
        style={[
          {
            width: width * 0.8,
            borderRadius: 10,
            borderColor: 'white',
            height: 50,
            backgroundColor: '#8B7FC5',
          },
          // {backgroundColor: disabled ? '#8B7FC5' : '#A39ACF'},
        ]}
        onPress={onNextStepPress}>
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
            letterSpacing: 1,
            fontSize: 18,
            textAlign: 'center',
          }}>
          Next
        </Text>
      </Button>
    </ScrollView>
  );
}
export default FirstStep;
