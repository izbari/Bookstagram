import React, {useState, useCallback} from 'react';
import {View, Dimensions, ScrollView} from 'react-native';
import {RadioButton, Text, Button} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
const {width} = Dimensions.get('window');
export default function SecondStep({onNextStepPress, setFormData}) {
  const [focus, setFocus] = useState(false);
  const [gender, setGender] = useState('male');
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);
  const onConfirm = date => {
    setOpen(false);
    setDate(date);
    setFormData(prev => ({...prev, birth: moment(date).format('DD-MM-YYYY')}));
  };
  const onCancel = () => {
    setOpen(false);
  };
  const onOpen = () => {
    setOpen(true);
    setFocus(true);
  };
  const onGenderChanged = useCallback(
    val => {
      setFormData(prev => ({...prev, gender: val}));
      setGender(val);
    },
    [gender],
  );

  return (
    <ScrollView>
      <Text
        variant="headlineMedium"
        style={{marginVertical: 10, textAlign: 'center', marginBottom: 40}}>
        Please enter birth of date and gender
      </Text>
      <Button
        mode="contained"
        contentStyle={{height: 50, justifyContent: 'flex-start'}}
        labelStyle={{color: 'grey'}}
        // disabled={disabled}
        style={{
          marginVertical: 20,
          borderRadius: 10,
          height: 55,
          borderWidth: 2,
          borderColor: focus ? '#A39ACF' : '#ededed',
          backgroundColor: '#ededed',
        }}
        onPress={onOpen}>
        {!date ? 'Birth of Date' : moment(date).format('DD-MM-YYYY')}
      </Button>
      <DatePicker
        modal
        open={open}
        date={date ?? new Date()}
        mode="date"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      <RadioButton.Group
        style={{backgroundColor: 'black'}}
        value={gender}
        onValueChange={onGenderChanged}>
        <View
          style={{
            marginVertical: 20,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 40,
          }}>
          <View style={{flexDirection: 'row'}}>
            <RadioButton value="Male" color={'#8B7FC5'} />
            <Text style={{marginTop: 8, fontSize: 15}}>Male</Text>
          </View>
          <View style={{flexDirection: 'row', marginLeft: 70}}>
            <RadioButton value="Female" color={'#8B7FC5'} />
            <Text style={{marginTop: 8, fontSize: 15}}>Female</Text>
          </View>
        </View>
      </RadioButton.Group>

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