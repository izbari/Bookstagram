import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Icon from '../components/Icons';
import colors from '../constants/colors';
import ImagePlaceholder from '../assets/png/imagePlaceholder.jpg';

export default function SellScreen() {
  const [productHeader, setProductHeader] = useState('');
  const [productAuthor, setProductAuthor] = useState('');
  const [productExplanation, setProductExplanation] = useState('');

  const PhotoCard = ({image}) => {
    return (
      <>
        <Image
          source={image}
          style={{width: 100, height: 100, borderRadius: 10, marginRight: 10}}
          resizeMode="cover"
        />
      </>
    );
  };

  const PhotoCardFooter = () => {
    return (
      <TouchableOpacity
        style={{
          width: 100,
          height: 100,
          borderRadius: 10,
          backgroundColor: 'gray',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name="Add" size={50} fill="white" />
        <Text style={{color: 'white', fontSize: 10}}>Add Photo</Text>
      </TouchableOpacity>
    );
  };

  const products = [
    {
      image: ImagePlaceholder,
    },
    {
      image: ImagePlaceholder,
    },
    {
      image: ImagePlaceholder,
    },
    {
      image: ImagePlaceholder,
    },
    {
      image: ImagePlaceholder,
    },
    {
      image: ImagePlaceholder,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="BackArrow" size={25} fill="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Product Info</Text>
      </View>

      <View style={styles.photosContainer}>
        <View style={styles.photosHeader}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '25%',
              alignItems: 'center',
            }}>
            <Text>Photos</Text>
            <Text style={{fontSize: 12}}>{products.length}/10</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.photosInnerContainer}>
          <FlatList
            horizontal
            data={products}
            renderItem={({item}) => <PhotoCard image={item.image} />}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{alignItems: 'center', padding: 10}}
            ListFooterComponent={<PhotoCardFooter />}
            ListFooterComponentStyle={{marginRight: 10}}
          />
        </View>
      </View>

      <View style={styles.productHeaderContainer}>
        <Text style={styles.productHeader}>Book Header</Text>
        <TextInput
          value={productHeader}
          onChangeText={setProductHeader}
          style={styles.productHeaderInput}
          numberOfLines={1}
          placeholder="Write the name of the book you are selling"
          placeholderTextColor="#AEAEAE"
        />
      </View>

      <View style={styles.productAuthorContainer}>
        <Text style={styles.productAuthor}>Book Author</Text>
        <TextInput
          value={productAuthor}
          onChangeText={setProductAuthor}
          style={styles.productAuthorInput}
          numberOfLines={1}
          placeholder="Write the author of the book you are selling"
          placeholderTextColor="#AEAEAE"
        />
      </View>

      <View style={styles.productExplanationContainer}>
        <Text style={styles.productExplanation}>Product Explanation</Text>
        <TextInput
          value={productExplanation}
          onChangeText={setProductExplanation}
          numberOfLines={3}
          style={styles.productExplanationInput}
          placeholder="Write the explanation of the product you are selling"
          placeholderTextColor="#AEAEAE"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: '10%',
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4.65,
    elevation: 6,
    alignItems: 'center',
    padding: 15,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 10,
  },
  headerText: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 16,
    width: '40%',
  },
  photosContainer: {},
  photosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  editButton: {
    padding: 5,
  },
  editText: {
    color: colors.darkPurple,
    fontWeight: '600',
  },
  photosInnerContainer: {
    backgroundColor: 'white',
  },
  productHeaderContainer: {},
  productHeader: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop:20
  },
  productHeaderInput: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  productAuthor: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop:20
  },
  productAuthorInput: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  productExplanation: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop:20
  },
  productExplanationInput: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
});
