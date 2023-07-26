/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, ScrollView, SafeAreaView} from 'react-native';
// import {SearchBar} from 'react-native-elements';

import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import CreateChatItem from '../../components/Chat/CreateChatItem';
import CommonHeader from '../../components/Common/CommonHeader';
type ICreateChatProps = IWithNavigation<RouteNames.createChat>;
export const CreateChat: React.FunctionComponent<ICreateChatProps> = props => {
  const authUser = useAppSelector(state => state.user.user);
  const fallowers = authUser?.fallowing ?? [];
  return (
    <SafeAreaView style={{flex: 1}}>
      <CommonHeader title="Select a user" />

      <ScrollView>
        <Text
          style={{
            color: '#C4C4C4',
            fontWeight: 'bold',
            marginLeft: 10,
            marginTop: 10,
          }}>
          {'Users'}
        </Text>
        {fallowers?.map((id: string) => {
          return <CreateChatItem key={id} id={id} />;
        })}
      </ScrollView>
    </SafeAreaView>
  );
};
