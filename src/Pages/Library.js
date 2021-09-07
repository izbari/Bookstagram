import * as React from 'react';
import {SafeAreaView, StyleSheet, FlatList} from 'react-native';

import axios from 'axios';
import {useDispatch} from 'react-redux';
import {SearchBar} from 'react-native-elements';
import {TextInput} from 'react-native-paper';

import Login from '../components/Welcome';
import Loading from '../components/Loading';
import Error from '../components/Error';
import BookCard from '../components/BookCard';

function Library(props) {
  const dispatch = useDispatch();

  const [cardData, setCardData] = React.useState([]);
  const [search, setSearch] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }
  const favHandler = item => {
    dispatch({type: 'ADD_FAVORITE', payload: {bookCard: item}});
  };

  const renderItem = ({item}) => (
    <BookCard
      favHandler={() => {
        favHandler(item);
      }}
      toNavigateBookHandler={() => props.navigation.navigate('Favorites')}
      item={item}
    />
  );

  const getData = async (text = "java" ) => {
    
    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${text}&maxResults=20&langRestrict=en&orderBy=relevance&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0`;
    await axios
      .get(API_URL)
      .then(res => {
        setCardData(res.data.items);
      })
      .catch(err => {
        console.log(err);
        setError(true);
        setLoading(false);

      });

  };

  const seachSubject = async text => {
    setSearch(text);
    await getData(text);
  };

  return (
    <SafeAreaView>
      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={text => seachSubject(text)}
        autoCorrect={false}
        value={search}
      />

      <FlatList
        data={cardData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#FF6EA1'},
  lottieContainer: {
    flex: 2,
    width: '85%',
    height: '30%',
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

export default Library;
