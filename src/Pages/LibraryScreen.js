import * as React from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {TextInput, Searchbar} from 'react-native-paper';
import Loading from '../components/Loading';
import Error from '../components/Error';
import BookCard from '../components/BookCard';
const {width} = Dimensions.get('window');
function Library(props) {
  const dispatch = useDispatch();
  const list = useSelector(store => store.favList);
  const [cardData, setCardData] = React.useState([]);
  const [search, setSearch] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);
  const [splash, setSplash] = React.useState(true);
  const [error, setError] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(0);
  React.useEffect(() => {
    getData();
  }, [currentPage]);

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
  const handleLoadMore = param => {
    setLoading2(true);
    setCurrentPage(currentPage + 20);
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

  const getData = (text = 'bookstagram') => {
    setLoading2(true);
    setSplash(true);
    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${text}&maxResults=20&orderBy=relevance&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0&startIndex=${currentPage}`;
    axios
      .get(API_URL)
      .then(res => {
        setCardData(cardData.concat(res.data.items));
        setLoading(false);
        setLoading2(false);
        setSplash(false);
      })
      .catch(err => {
        console.log(err);
        setError(true);
        setLoading(false);
      });
  };
  if (splash) {
    return <Loading style={styles.lottieContainerError} />;
  }

  const renderFooter = () => {
    return loading2 ? (
      <View style={{alignItems: 'center', margin: 10}}>
        <ActivityIndicator size="small"></ActivityIndicator>
      </View>
    ) : null;
  };
  const refreshHandler = async params => {
    setLoading(true);
    await setCardData([]);
    getData();
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Searchbar
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
      />

      <FlatList
        data={cardData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0}
        ListFooterComponent={renderFooter}
        onRefresh={refreshHandler}
        refreshing={loading}
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
