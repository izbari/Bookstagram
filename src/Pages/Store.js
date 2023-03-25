import * as React from 'react';
import {SafeAreaView, StyleSheet, FlatList, View, Text} from 'react-native';
import {useSelector} from 'react-redux';
import BookCard from '../components/BookCard';
import FastImage from 'react-native-fast-image';
function Store(props) {
  const data = useSelector(s => s.cartList);
  const list = useSelector(store => store.favList);
  if (data?.length === 0) {
    return (
      <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'center'}}>
        <FastImage
          style={{height: 550, width: 700}}
          source={require('../assets/png/EmptyList.jpg')}
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      <FlatList
        data={data}
        renderItem={({item}) => (
          <BookCard
            list={list}
            currentScreen="Store"
            navigate={props.navigation.navigate}
            item={item}
          />
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              margin: 15,
              marginTop: 100,
            }}>
            <Text style={{fontStyle: 'italic', fontSize: 16}}>
              Your Card is Empty Ups !!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#E1E8EE'},
});

export default Store;
