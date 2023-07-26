import * as React from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Text,
  Pressable,
} from 'react-native';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import BookCard from '../../components/BookSearch/BookCard';
import database from '@react-native-firebase/database';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../resources/constants/Colors';
type IBookSearchProps = IWithNavigation<RouteNames.searchBook>;
export const BookSearch: React.FunctionComponent<IBookSearchProps> = props => {
  const dispatch = useDispatch();
  const user = useAppSelector(store => store.user.user);
  const [cardData, setCardData] = React.useState([]);
  const [search, setSearch] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);
  const [splash, setSplash] = React.useState(true);
  const [error, setError] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(0);

  // if (error) {
  //   return <Error style={styles.lottieContainerError} />;
  // }
  React.useEffect(() => {
    getData();
  }, [getData]);

  const handleLoadMore = param => {
    setLoading2(true);
    setCurrentPage(currentPage + 20);
  };
  const handleFavorite = React.useCallback(
    (id: string) => {
      let favoriteBooks = user?.favoriteBooks ?? [];
      if (favoriteBooks?.includes(id)) {
        favoriteBooks = favoriteBooks.filter(item => item !== id);
      } else {
        favoriteBooks = [...favoriteBooks, id];
      }
      database().ref(`users/${user?.id}`).update({favoriteBooks});
    },
    [user?.favoriteBooks, user?.id],
  );
  const getData = React.useCallback(
    async (text = 'bookstagram') => {
      console.warn(text);
      setLoading2(true);
      setSplash(true);
      const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${text}&maxResults=20&orderBy=relevance&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0&startIndex=${currentPage}`;
      axios
        .get(API_URL)
        .then(res => {
          setCardData(res.data.items);
          setLoading(false);
          setLoading2(false);
          setSplash(false);
        })
        .catch(err => {
          console.log(err);
          setError(true);
          setLoading(false);
          setLoading2(false);
        });
    },
    [cardData, currentPage],
  );

  // if (splash) {
  //   return <Loading style={styles.lottieContainerError} />;
  // }

  const renderFooter = () => {
    return loading2 ? (
      <View style={{alignItems: 'center', margin: 10}}>
        <ActivityIndicator size="small" />
      </View>
    ) : null;
  };
  const refreshHandler = async params => {
    setLoading(true);
    await setCardData([]);
    getData();
  };
  const [searchFocus, setSearchFocus] = React.useState(false);
  const inputRef = React.useRef(null);
  const [text, setText] = React.useState('');
  const handleSearch = React.useCallback(
    text => {
      setText(text);
      getData(text);
    },
    [getData],
  );
  console.warn(cardData?.[0]?.volumeInfo?.title);
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <Searchbar
        onIconPress={() => getData(search)}
        icon={'arrow-left'}
        style={{
          marginTop: 15,
          alignSelf: 'center',
          height: 45,
          margin: 5,
          marginBottom: 0,
          backgroundColor: 'white',
          width: width * 0.9,
          borderRadius: 10,
        }}
        inputStyle={{fontSize: 15}}
        placeholder="Type Something ..."
        onChangeText={setSearch}
        value={search}
      /> */}
      <Pressable
        onPress={() => inputRef?.current?.focus?.()}
        style={tw`flex-row items-center h-16 `}>
        <View
          style={[
            tw`flex-row m-2  shadow-md bg-white rounded-lg items-center px-2 justify-evenly p-4`,
            searchFocus && {width: '80%'},
          ]}>
          <Ionicons name="search-outline" size={20} color="gray" />
          <TextInput
            ref={inputRef}
            style={tw` flex-1 ml-2 h-full`}
            placeholder="Search..."
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
            onChangeText={handleSearch}
            value={text}
          />
        </View>
        {searchFocus && (
          <TouchableOpacity onPress={Keyboard.dismiss} style={tw`p-1`}>
            <Text style={tw`text-[${Colors.darkPurple}] font-semibold`}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </Pressable>
      <FlatList
        data={cardData}
        renderItem={({item}) => (
          <BookCard
            handleFavorite={handleFavorite}
            item={item}
            isFavorited={user?.favoriteBooks?.includes(item?.id)}
          />
        )}
        keyExtractor={item => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0}
        ListFooterComponent={renderFooter}
        refreshing={loading}
        onRefresh={refreshHandler}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#E1E8EE'},
  lottieContainer: {
    width: '10%',
    height: '5%',
    alignSelf: 'center',
  },
  lottieContainerError: {
    width: '50%',
    height: '50%',
    alignSelf: 'center',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonContainer: {flex: 1, margin: 10},
  button: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    width: 290,
    height: 38,
    backgroundColor: '#FF6EA1',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    paddingLeft: 12,
    borderRadius: 10,

    width: 290,
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 10,
    backgroundColor: 'white',
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
