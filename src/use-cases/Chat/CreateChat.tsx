/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, ActivityIndicator, ScrollView, SafeAreaView} from 'react-native';
// import {SearchBar} from 'react-native-elements';

import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import CreateChatItem from '../../components/Chat/CreateChatItem';
type ICreateChatProps = IWithNavigation<RouteNames.createChat>;
export const CreateChat: React.FunctionComponent<ICreateChatProps> = props => {
  const authUser = useAppSelector(state => state.user.user);
  const [loading, setLoading] = React.useState(false);

  const [search, setSearch] = React.useState('');

  const [users, setUsers] = React.useState([]);
  const [searchedUsers, setSearchedUsers] = React.useState([]);

  const [searchedMyChats, setSearchedMyChats] = React.useState([]);

  const searchFilterFunction = text => {
    const newData = searchedUsers.filter(item => {
      const itemData = `${item.name.toUpperCase()}   
      ${item.lastName.toUpperCase()}`;
      return itemData.indexOf(text.toUpperCase()) > -1;
    });

    const newData2 = searchedMyChats.filter(item => {
      const itemData = `${item.name.toUpperCase()} 
      ${item.lastName.toUpperCase()}`;
      return itemData.indexOf(text.toUpperCase()) > -1;
    });

    setUsers(newData);
    setMyChats(newData2);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <SearchBar
        containerStyle={{
          alignSelf: 'center',
          height: 45,
          margin: 7,
          backgroundColor: '#DEDFE4',
          width: width * 0.9,
          borderRadius: 15,
        }}
        inputContainerStyle={{height: 10, backgroundColor: '#DEDFE4'}}
        inputStyle={{fontSize: 15}}
        placeholder="Type Something ..."
        lightTheme
        onChangeText={text => {
          setSearch(text);
          searchFilterFunction(text);
        }}
        autoCorrect={false}
        value={search}
      /> */}
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
        {loading ? (
          <ActivityIndicator size="large" color="#FF6EA1" />
        ) : (
          (authUser?.fallowers ?? []).map((item: any) => {
            return <CreateChatItem key={item} id={item} />;
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
