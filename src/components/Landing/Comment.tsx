import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Image from 'react-native-fast-image';
// import ThreeDotMenu from '../../ThreeDotMenu';
import tw from 'twrnc';

import moment from 'moment';
interface ICommentProps {
  readonly img: string;
  readonly name: string;
  readonly comment: string;
  readonly postTime: string;
}
export const Comment: React.FunctionComponent<ICommentProps> = props => {
  return (
    <View style={tw`flex-row w-full my-2 mx-2 items-center justify-between`}>
      <Image
        style={tw`w-10 h-10 rounded-full`}
        source={{
          uri: props.img,
        }}
      />
      <View>
        <View style={tw`bg-gray-200 rounded-lg`}>
          <View style={tw`flex-row justify-between`}>
            <Text style={tw`font-bold p-2`}>{props.name}</Text>
            {/* <ThreeDotMenu comment={true} /> */}
          </View>

          <View style={tw`p-4 pt-0 pl-2`}>
            <Text>{props.comment}</Text>
          </View>
        </View>
        <View style={tw`flex-row justify-between`}>
          <Text style={tw`text-gray-400`}>
            {moment(props.postTime.toDate()).fromNow()}
          </Text>
          <TouchableOpacity>
            <Text style={tw`text-gray-400`}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={tw`text-gray-400`}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
