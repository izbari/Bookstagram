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
import {SearchBar} from 'react-native-elements';
import {useSearch} from '../utils/searchUtils';
import Loading from '../components/Loading';
import Error from '../components/Error';
import BookCard from '../components/BookCard';
const {width} = Dimensions.get('window');
function Library(props) {
  const dispatch = useDispatch();
  const list = useSelector(store => store.favList);
  const [cardData, setCardData] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);
  const [loading3, setLoading3] = React.useState(false);

  //const [splash, setSplash] = React.useState(true);
  const [error, setError] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(0);
  

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

  const handleLoadMore = async param => {
    if(!loading3){
     setCurrentPage(currentPage+ 40);
    console.log("currentPage1=" + currentPage)

    const res = await getLoadMoreData(search,currentPage);
}
  };


 const getLoadMoreData = async(text,currentPage) => {   
     setLoading3(true);

   console.log("currentPage2=" + currentPage)
    // same input with pagination
    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${text}&maxResults=40&orderBy=relevance&startIndex=${currentPage+40}&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0`;
    const res = await axios(API_URL);
    setCardData(cardData.concat(res.data.items));
    setLoading3(false);
   }
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

  const getData = async text => {
   
      //new searching
      const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${text}&maxResults=40&orderBy=relevance&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0`;

      setLoading2(true);
      const res = await useSearch(API_URL);
      const bookData = res;
      setLoading2(false);
      setLoading(false);
      setCardData(bookData);
    
  };
  const onChangeHandler = async e => {
    setCurrentPage(0);
    getData(e);
    setSearch(e);
  };

  const renderFooter = () => {
    return loading3 ? (
      <View style={{alignItems: 'center', margin: 10}}>
        <ActivityIndicator size="small"></ActivityIndicator>
      </View>
    ) : null;
  };
  const refreshHandler = () => {
    setLoading(true);
    getData(search);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <SearchBar
        //onIconPress = {()=>getData(search)}
        containerStyle={{
          marginTop: 15,
          alignSelf: 'center',
          height: 45,
          margin: 7,
          backgroundColor: '#CED5DA',
          width: width * 0.9,
          borderRadius: 15,
        }}
        inputContainerStyle={{height: 10, backgroundColor: '#CED5DA'}}
        inputStyle={{fontSize: 15}}
        placeholder="Type Something ..."
        lightTheme
        onChangeText={text => onChangeHandler(text)}
        autoCorrect={false}
        value={search}
      />
      {loading2 ? (
        <View style={{alignItems: 'center', margin: 10}}>
          <ActivityIndicator size="small"></ActivityIndicator>
        </View>
      ) : null}

      <FlatList
        data={cardData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={handleLoadMore}
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
