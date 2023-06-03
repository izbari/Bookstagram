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
  readonly postTime: Date;
}
export const Comment: React.FunctionComponent<ICommentProps> = props => (
  <View style={tw`flex-1 flex-row m-4 items-center `}>
    <Image
      resizeMode={Image.resizeMode.contain}
      style={tw`w-10 h-10 rounded-full mr-2 `}
      source={{
        uri: props.img,
      }}
    />
    <View style={tw`flex-1`}>
      <View style={tw`bg-gray-200 rounded-lg`}>
        <View style={tw`flex-row justify-between`}>
          <Text style={tw`font-bold p-2 text-xs`}>{props.name}</Text>
          {/* <ThreeDotMenu comment={true} /> */}
        </View>

        <View style={tw`p-4 pt-0 pl-2`}>
          <Text style={tw`text-xs`}>{props.comment}</Text>
        </View>
      </View>
      <View style={tw`flex-1 flex-row justify-between w-3/5 mt-1 mx-2`}>
        <Text style={tw`text-xs text-gray-400`}>
          {moment(props.postTime?.toDate?.()).fromNow()}
        </Text>
        <TouchableOpacity>
          <Text style={tw`text-xs text-gray-400 font-extrabold	`}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={tw`text-xs text-gray-400 font-extrabold	`}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
