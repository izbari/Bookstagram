import {TextInput, View,TouchableOpacity,Keyboard} from 'react-native';
import React from 'react';
import Icon from '../../../components/Icons';
import {useSelector,useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';

const customTextInput = ({setVisible,visible,item}) => {
  const {t} = useTranslation();
    const [height, setHeight] = React.useState(0);
    const [postText, setPostText] = React.useState('');

    const dispatch = useDispatch();
    const user = useSelector(store => store.user);
   if(!visible){
    return null;
   }
  return (
     <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#F0F2F5',
        alignItems: 'flex-end',
      }}>
       <TextInput
        onContentSizeChange={event => {
          setHeight(event.nativeEvent.contentSize.height);
        }}
        style={{
          height: Math.max(45, height),
          padding: 10,
          margin: 2,
          flex: 1,
        }}
        value={postText}
        multiline
        autoCorrect
        numberOfLines={7}
        placeholder={t('common:WhatYouAreThinking')}
        onChangeText={setPostText}></TextInput>
      <TouchableOpacity
      style={{alignSelf:'center',padding:10}}
      disabled={postText.length== 0 ? true : false}
        onPress={async () => {

          dispatch({type: 'ADD_COMMENT', payload: {postText:postText,item:item,user:user}});
          setPostText('');
          setVisible(false);
          Keyboard.dismiss();
        
        }}>
        <Icon name={'Send'} size={25} fill={postText.length== 0 ? "grey":"#FF6EA1"} style={{padding:10}}  />
      </TouchableOpacity>
    </View>
  );
};

export default customTextInput;

