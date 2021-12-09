import * as React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { TextInput } from 'react-native-paper';
import BookCard from '../components/BookCard';

function App(props) {
  const data = useSelector(s => s.cartList)
  const favList = useSelector(store=> store.favList)

  const dispatch = useDispatch();

  const removeFromCart = (item) => {

    dispatch({ type: 'REMOVE_CART', payload: { rmCartBook: item } })

  };
  const favHandler = item => {
    if (favList.includes(item)) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: { rmFavBook: item } });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: { favCard: item } });
    }
  };
  return (
    <SafeAreaView style={styles.mainContainer}>

      <FlatList
        data={data}
        renderItem={({ item }) =>
          <BookCard
            toNavigateBookDetails={(item) => props.navigation.navigate('SingleBookDesc',{singleBookData:item})}
            removeFromCart={(item) => removeFromCart(item)}
            favHandler={(item)=> favHandler(item)}
            from="store"
            item={item}
          />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#E1E8EE' },
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
  buttonContainer: { flex: 1, margin: 10 },
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
