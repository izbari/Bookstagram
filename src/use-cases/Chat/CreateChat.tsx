import React from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
// import {SearchBar} from 'react-native-elements';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';

import auth from '@react-native-firebase/auth';
import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import ParseFirebaseData from '../../infrastructure/Utils/ParseFirebaseData';
type ICreateChatProps = IWithNavigation<RouteNames.createChat>;
const {width} = Dimensions.get('window');
export const CreateChat: React.FunctionComponent<ICreateChatProps> = ({
  navigation,
  route,
}) => {
  let {myChats} = route.params;
  const [loading, setLoading] = React.useState(false);

  const [search, setSearch] = React.useState('');

  const [users, setUsers] = React.useState([]);
  const [searchedUsers, setSearchedUsers] = React.useState([]);

  const [MyChats, setMyChats] = React.useState([]);
  const [searchedMyChats, setSearchedMyChats] = React.useState([]);

  React.useEffect(() => {
    myChats = myChats.filter(
      (value, index, self) => index === self.findIndex(t => t.id === value.id),
    );

    getData();
    setSearchedMyChats(myChats);
    setMyChats(myChats);
  }, [, myChats]);

  const getData = async () => {
    setLoading(true);
    await database()
      .ref('/users/')
      .once('value')
      .then(snapshot => {
        let data = ParseFirebaseData(snapshot?.val(), auth()?.currentUser?.uid);
        data = data.filter(user => {
          return (
            user.id !== auth().currentUser.uid &&
            !myChats.find(element => element.id == user.id)
          );
        });

        setUsers(data);
        setSearchedUsers(data);
        setLoading(false);
      });
  };
  const spesificChat = item => {
    let chatId = 'null';
    let idPair =
      auth().currentUser.uid < item.id
        ? auth().currentUser.uid + '-' + item.id
        : item.id + '-' + auth().currentUser.uid;
    firestore()
      .collection('Chats')
      .where('users', 'array-contains', idPair)
      .onSnapshot(snapshot => {
        snapshot.docs.forEach(chat => {
          chatId = chat._ref._documentPath._parts['1']
            ? chat._ref._documentPath._parts['1']
            : 'null';
        });

        navigation.navigate(RouteNames.singleChat, {
          name: item.name + ' ' + item.lastName,
          imageUrl: item.imageUrl,
          chatId: chatId,
          uid: item.id,
        });
      });
  };

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

  const UserItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          spesificChat(item);
        }}
        style={{
          flexDirection: 'row',
          width: width * 0.95,
          margin: 10,
          marginBottom: 3,
          alignSelf: 'center',

          backgroundColor: 'white',
          borderRadius: 10,
          shadowColor: '#CBCBCB',
          elevation: 25,
        }}>
        <Image
          style={{
            height: 50,
            width: 50,
            resizeMode: 'contain',
            borderRadius: 50,
            overflow: 'hidden',
            elavation: 15,
            margin: 7,
          }}
          source={{uri: item.imageUrl}}
        />

        <View style={{justifyContent: 'center', marginLeft: 10, padding: 5}}>
          <Text style={{fontWeight: 'bold'}}>
            {item.name + ' ' + item.lastName}
          </Text>
          <View
            style={{flexDirection: 'row', width: width - (width * 0.05 + 90)}}>
            <Text
              numberOfLines={1}
              style={{
                fontStyle: 'italic',
                fontSize: 12,
                color: 'grey',
                marginTop: 5,
              }}>
              {"User's cool bio..."}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
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
        <View>
          {MyChats.length !== 0 ? (
            <Text
              style={{color: '#C4C4C4', fontWeight: 'bold', marginLeft: 10}}>
              {'My Friends'}
            </Text>
          ) : null}

          {MyChats.length > 0 &&
            MyChats.sort((a, b) => a.name.localeCompare(b.name)).map(item => {
              return <UserItem key={item.id} item={item} />;
            })}
        </View>

        <Text
          style={{
            color: '#C4C4C4',
            fontWeight: 'bold',
            marginLeft: 10,
            marginTop: 10,
          }}>
          {'Other Users'}
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6EA1" />
        ) : (
          users
            ?.sort((a, b) => a?.name?.localeCompare(b?.name))
            .map(item => {
              return <UserItem key={item.id} item={item} />;
            })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
