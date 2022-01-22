import * as React from 'react';
import {SafeAreaView, StyleSheet, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import BookCard from '../components/BookCard';

function Store(props) {
  const dispatch = useDispatch();
  const data = useSelector(s => s.cartList);
  const favList = useSelector(store => store.favList);

  const removeFromCart = item => {
    dispatch({type: 'REMOVE_CART', payload: {rmCartBook: item}});
  };
  const favHandler = item => {
    if (favList.includes(item)) {
      dispatch({type: 'REMOVE_FAVORITE', payload: {rmFavBook: item}});
    } else {
      dispatch({type: 'ADD_FAVORITE', payload: {favCard: item}});
    }
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <BookCard
            toNavigateBookDetails={(item) =>
              props.navigation.navigate('SingleBookDesc', {
                singleBookData: item,
              })
            }
            removeFromCart={item => removeFromCart(item)}
            favHandler={item => favHandler(item)}
            from="store"
            item={item}
          />
        )}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#E1E8EE'},
});

export default Store;
