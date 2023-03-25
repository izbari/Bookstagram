import {
  View,
  TouchableOpacity,
  Keyboard,
  Pressable,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Icon from '../../../components/Icons';

import FastImage from 'react-native-fast-image';
import Entypo from 'react-native-vector-icons/Entypo';
import tw from 'twrnc';
import EmojiSelector from 'react-native-emoji-selector';
import {BottomSheetTextInput, BottomSheetView} from '@gorhom/bottom-sheet';
import {useKeyboardVisible} from '../../../utils/keyboardListener';

const BottomsheetCommentAction = ({onAddCommentPress, imageUrl}) => {
  const isKeyboardActive = useKeyboardVisible();
  const [comment, setComment] = useState('');
  const sendCommentPress = () => {
    onAddCommentPress(comment);
    setComment('');
    Keyboard.dismiss();
  };
  const [showEmoji, setShowEmoji] = useState(false);

  const closeEmojiSelector = () => {
    setShowEmoji(false);
  };
  const changeEmojiOpenState = () => {
    Keyboard.dismiss();
    setShowEmoji(curr => !curr);
  };
  const emojiPress = emoji => {
    setComment(curComment => curComment + emoji);
  };
  const hasCommentLenght = comment.length > 0;
  const bottomInset = Platform.OS === 'ios' ? 0 : isKeyboardActive ? -12 : 0;
  return (
    <BottomSheetView
      style={tw`bg-white items-center justify-center  w-full p-4   border-t border-gray-200 `}>
      <View style={tw`flex-row items-center`}>
        <FastImage
          style={tw`h-10 w-10 rounded-full self-end`}
          source={{
            uri: imageUrl,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Pressable
          onPress={closeEmojiSelector}
          style={tw`bg-gray-200 flex-row justify-between rounded-lg ml-2 w-5/6 py-4`}>
          <BottomSheetTextInput
            scrollEnabled
            onFocus={closeEmojiSelector}
            textAlignVertical="center"
            autoComplete="off"
            autoCorrect={false}
            style={tw`rounded-lg p-2 w-3/4`}
            placeholder="Write a comment..."
            placeholderTextColor="#909090"
            onChangeText={setComment}
            multiline
            value={comment}
          />
          <View style={tw`flex-row self-end`}>
            <TouchableOpacity
              style={tw`self-center pr-2`}
              onPress={changeEmojiOpenState}>
              <Entypo name={'emoji-happy'} size={22} fill={'#FF6EA1'} />
            </TouchableOpacity>
            {hasCommentLenght && (
              <TouchableOpacity
                style={tw`self-center p-2 px-2`}
                onPress={sendCommentPress}>
                <Icon name={'Send'} size={22} fill={'#FF6EA1'} />
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </View>
      {showEmoji && (
        <View style={[tw`w-full h-70 `, {zIndex: 999}]}>
          <EmojiSelector
            showSectionTitles={false}
            showHistory={true}
            onEmojiSelected={emojiPress}
            showSearchBar={false}
          />
        </View>
      )}
    </BottomSheetView>
  );
};
export default BottomsheetCommentAction;
