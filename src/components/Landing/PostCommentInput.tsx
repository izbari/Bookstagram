import {
  View,
  TouchableOpacity,
  Keyboard,
  Pressable,
  Platform,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import Entypo from 'react-native-vector-icons/Entypo';
import tw from 'twrnc';
import EmojiSelector from 'react-native-emoji-selector';
import {useKeyboardVisible} from '../../infrastructure/Utils/useKeyboardVisible';
import {Colors} from '../../resources/constants/Colors';
type IPostCommentInput = {
  readonly onAddCommentPress: (comment: string) => void;
  readonly imageUrl: string | undefined;
  readonly isFocused?: boolean;
};
export const PostCommentInput: React.FunctionComponent<
  IPostCommentInput
> = props => {
  const isKeyboardActive = useKeyboardVisible();
  const [comment, setComment] = useState('');
  const sendCommentPress = () => {
    props.onAddCommentPress(comment);
    setComment('');
    setShowEmoji(false);
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
  return (
    <View
      style={tw`bg-white items-center justify-center  p-4  border-t border-gray-200  `}>
      <View style={tw`flex-row items-center`}>
        <FastImage
          style={tw`h-10 w-10 rounded-full self-end`}
          source={{
            uri: props.imageUrl,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Pressable
          onPress={closeEmojiSelector}
          style={tw`bg-gray-200 flex-row justify-between rounded-lg ml-2 w-5/6 py-4`}>
          <TextInput
            verticalAlign="top"
            scrollEnabled
            autoFocus={props?.isFocused}
            onFocus={closeEmojiSelector}
            textAlignVertical="center"
            autoComplete="off"
            autoCorrect={false}
            style={tw`ml-2 rounded-lg p-2 w-3/4`}
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
              <Entypo
                name={'emoji-happy'}
                size={22}
                color={Colors.lightPurple}
              />
            </TouchableOpacity>
            {hasCommentLenght && (
              <TouchableOpacity
                style={tw`self-center p-2 px-2`}
                onPress={sendCommentPress}>
                <Ionicons name={'send'} size={22} color={Colors.lightPurple} />
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </View>
      {showEmoji && (
        <View style={[tw`w-full h-70 `]}>
          <EmojiSelector
            showSectionTitles={false}
            showHistory={true}
            onEmojiSelected={emojiPress}
            showSearchBar={false}
          />
        </View>
      )}
    </View>
  );
};
