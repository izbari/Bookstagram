import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import React from 'react';
import {Searchbar} from 'react-native-paper';
import Icon from '../components/Icons';
import SecondHandSaleCard from '../components/SecondHandSaleCard.js/secondHandSaleCard';
import ImagePlaceholder from '../assets/png/imagePlaceholder.jpg';
import colors from '../constants/colors';

export default function SecondHandSaleScreen() {
  const books = [
    {
      title: 'Java',
      price: 10,
      image: ImagePlaceholder,
    },
    {
      title: 'Jotform',
      price: 20,
      image: ImagePlaceholder,
    },
    {
      title: 'Harry Potter',
      price: 30,
      image: ImagePlaceholder,
    },
    {
      title: 'Fahrenheit 451',
      price: 40,
      image: ImagePlaceholder,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          iconColor={colors.lightPurple}
          placeholder="Search"
          placeholderTextColor="gray"
          style={styles.searchBar}
          inputStyle={styles.input}
        />
        <TouchableOpacity style={styles.favorites}>
          <Icon name="Like" size={25} fill={colors.lightPurple} />
        </TouchableOpacity>
      </View>
      <FlatList
        numColumns={2}
        data={books}
        renderItem={({item}) => (
          <SecondHandSaleCard
            title={item.title}
            price={item.price}
            image={item.image}
          />
        )}
        columnWrapperStyle={{justifyContent: 'space-evenly'}}
        showsVerticalScrollIndicator={true}
        style={{marginTop:10}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 4.65,
    elevation: 10,
  },
  searchBar: {
    width: '80%',
    margin: 15,
    borderRadius: 30,
    height: 38,
    justifyContent: 'center',
    alignContent: 'center',
    marginLeft: 15,
  },
  input: {
    fontSize: 15,
  },
  favorites: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
