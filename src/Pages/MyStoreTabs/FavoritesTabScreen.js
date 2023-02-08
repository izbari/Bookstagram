import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import ImagePlaceholder from '../../assets/png/imagePlaceholder.jpg';
import SecondHandSaleCard from '../../components/SecondHandSaleCard/secondHandSaleCard';

export default function FavoritesTabScreen() {
  const books = [
    {
      title: 'Java',
      price: '10 TL',
      image: ImagePlaceholder,
    },
    {
      title: 'Jotform',
      price: '20 TL',
      image: ImagePlaceholder,
    },
    {
      title: 'Harry Potter',
      price: '30 TL',
      image: ImagePlaceholder,
    },
    {
      title: 'Fahrenheit 451',
      price: '40 TL',
      image: ImagePlaceholder,
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