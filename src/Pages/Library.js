import * as React from 'react';
import {SafeAreaView, StyleSheet, Button, View, FlatList} from 'react-native';

import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {SearchBar} from 'react-native-elements';
import {TextInput} from 'react-native-paper';

import Login from '../components/Welcome';
import Loading from '../components/Loading';
import Error from '../components/Error';
import BookCard from '../components/BookCard';

function Library(props) {
  const dispatch = useDispatch();
  const list = useSelector(store => store.favList);
  const [cardData, setCardData] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    getData();
  }, []);

  if (error) {
    return <Error style={styles.lottieContainerError} />;
  }
  const cartDetailsHandler = item => {
    props.navigation.navigate('SingleBookDesc', {
      singleBookData: item,
    });
  };
  const favHandler = item => {
    if (list.includes(item)) {
      dispatch({type: 'REMOVE_FAVORITE', payload: {rmFavBook: item}});
    } else {
      dispatch({type: 'ADD_FAVORITE', payload: {favCard: item}});
    }
  };
  const cartHandler = item => {
    dispatch({type: 'ADD_CART', payload: {cartCard: item}});
  };

  const renderItem = ({item}) => (
    <BookCard
      from="library"
      favHandler={item => {
        favHandler(item);
      }}
      cartHandler={item => {
        cartHandler(item);
      }}
      cartDetailsHandler={item => {
        cartDetailsHandler(item);
      }}
      item={item}
    />
  );

  const getData = (text = 'java') => {
    setLoading(true);

    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${text}&maxResults=20&orderBy=relevance&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0`;
    axios
      .get(API_URL)
      .then(res => {
        setTimeout(() => {
          setCardData(res.data.items);
        }, 1000);

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError(true);
        setLoading(false);
      });
  };

  const seachSubject = text => {
    setSearch(text);
    getData(text);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={text => seachSubject(text)}
        autoCorrect={false}
        value={search}
      />

      {loading && (
        <View style={styles.lottieContainer}>
          <Loading />
        </View>
      )}
      <FlatList
        data={cardData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}
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

export default Library;
