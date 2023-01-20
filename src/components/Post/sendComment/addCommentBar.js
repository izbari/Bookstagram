// import {TextInput, View,TouchableOpacity,Keyboard} from 'react-native';
// import React from 'react';
// import Icon from '../../../components/Icons';
// import {useSelector,useDispatch} from 'react-redux';
// import {useTranslation} from 'react-i18next';

// const customTextInput = ({setVisible,visible,item}) => {
//   const {t} = useTranslation();
//     const [height, setHeight] = React.useState(0);
//     const [postText, setPostText] = React.useState('');

//     const dispatch = useDispatch();
//     const user = useSelector(store => store.user);
//    if(!visible){
//     return null;
//    }
//   return (
//      <View
//       style={{
//         flexDirection: 'row',
//         backgroundColor: '#F0F2F5',
//         alignItems: 'flex-end',
//       }}>
//        <TextInput
//         onContentSizeChange={event => {
//           setHeight(event.nativeEvent.contentSize.height);
//         }}
//         style={{
//           height: Math.max(45, height),
//           padding: 10,
//           margin: 2,
//           flex: 1,
//         }}
//         value={postText}
//         multiline
//         autoCorrect
//         numberOfLines={7}
//         placeholder={t('common:WhatYouAreThinking')}
//         onChangeText={setPostText}></TextInput>
//       <TouchableOpacity
//       style={{alignSelf:'center',padding:10}}
//       disabled={postText.length== 0 ? true : false}
//         onPress={async () => {
// dispatch({type: 'ADD_COMMENT', payload: {postText:postText,item:item,user:user}});
//           setPostText('');
//           setVisible(false);
//           Keyboard.dismiss();

//         }}>
//         <Icon name={'Send'} size={25} fill={postText.length== 0 ? "grey":"#FF6EA1"} style={{padding:10}}  />
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default customTextInput;

import {
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import Icon from '../../../components/Icons';
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import FastImage from 'react-native-fast-image';
import Entypo from 'react-native-vector-icons/Entypo';
import tw from 'twrnc';
import {Button} from 'react-native-paper';
import EmojiSelector from 'react-native-emoji-selector';

const {width} = Dimensions.get('window');

const BottomsheetCommentAction = ({onAddCommentPress, imageUrl}) => {
  const [comment, setComment] = useState('');
  const sendCommentPress = () => {
    onAddCommentPress(comment);
    setComment('');
    Keyboard.dismiss();
  };
  const [showEmoji, setShowEmoji] = useState(false);

  const [height, setHeight] = useState(0);
  const handleHeight = React.useCallback(event => {
    setHeight(event.nativeEvent.contentSize.height);
  }, [height]);

  return (
    <View
      style={tw`bg-white items-center justify-center  w-full p-4  absolute bottom-0  border-t border-gray-200 `}>
      <View style={tw`flex-row items-center`}>
        <FastImage
          style={tw`h-9 w-9 rounded-full self-end`}
          source={{
            uri: imageUrl,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Pressable
          onPress={() => setShowEmoji(false)}
          style={tw`bg-gray-200 flex-row justify-between rounded-lg ml-2 w-5/6 py-4`}>
          <TextInput
            onContentSizeChange={handleHeight}
            textAlignVertical="center"
            autoComplete="off"
            autoCorrect={false}
            style={tw`rounded-lg h-${Math.max(10, height + 10)}px p-2 w-3/4`}
            placeholder="Write a comment..."
            placeholderTextColor="#909090"
            onChangeText={setComment}
            multiline
            value={comment}
          />
          <View style={tw`flex-row self-end`}>
            <TouchableOpacity
              style={tw`self-center pr-2`}
              onPress={() => setShowEmoji(prev => !prev)}>
              <Entypo name={'emoji-happy'} size={22} fill={'#FF6EA1'} />
            </TouchableOpacity>
            {comment.length !== 0 && (
              <TouchableOpacity
                style={tw`self-center p-2 px-2`}
                disabled={comment.length == 0 ? true : false}
                onPress={sendCommentPress}>
                <Icon name={'Send'} size={22} fill={'#FF6EA1'} />
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </View>
      {showEmoji && (
        <View style={tw`w-full h-70`}>
          <EmojiSelector
            showSectionTitles={false}
            showHistory={true}
            onEmojiSelected={emoji => setComment(prev => prev + emoji)}
            showSearchBar={false}
          />
        </View>
      )}
    </View>
  );
};
export default BottomsheetCommentAction;
