import { StyleSheet, View, FlatList } from 'react-native'
import React from 'react'
import SecondHandSaleCard from '../../components/SecondHandSaleCard/secondHandSaleCard';

export default function FavoritesTabScreen() {
  const books = [
    {
      title: 'Java',
      price: '10 TL',
      image: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",

    },
    {
      title: 'Jotform',
      price: '20 TL',
      image: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",

    },
    {
      title: 'Harry Potter',
      price: '30 TL',
      image: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",

    },
    {
      title: 'Fahrenheit 451',
      price: '40 TL',
      image: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",

    },
  ];

  return (
    <View style={styles.container}>
    <FlatList
      numColumns={2}
      data={books}
      renderItem={({item}) => (
        <SecondHandSaleCard
          title={item.title}
          price={item.price}
          image={item.image}
          isMine={false}
        />
      )}
      columnWrapperStyle={{justifyContent: 'space-evenly'}}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={{paddingBottom:10, paddingTop:10}}
    />
  </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex:1
    }
})