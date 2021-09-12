import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import BookCard from '../components/BookCard';
import {TextInput, Searchbar} from 'react-native-paper';

function App(props) {
  const dispatch = useDispatch();
  const list = useSelector(s => s.favList)
    .slice()
    .reverse();
  const favHandler = item => {
    if (list.includes(item)) {
      dispatch({type: 'REMOVE_FAVORITE', payload: {rmFavBook: item}});
    } else {
      dispatch({type: 'ADD_FAVORITE', payload: {favCard: item}});
    }
  };
  const removeFromFavorites = item => {
    dispatch({type: 'REMOVE_FAVORITE', payload: {rmFavBook: item}});
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <FlatList
        data={list}
        renderItem={({item}) => (
          <BookCard
            favHandler={item => {
              favHandler(item);
            }}
            removeFromFavorites={item => removeFromFavorites(item)}
            from="favorites"
            item={item}
            toNavigateBookDetails={item =>
              props.navigation.navigate('SingleBookDesc', {
                singleBookData: item,
              })
            }
          />
        )}
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
});

export default App;
