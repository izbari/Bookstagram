import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import Icon from '../components/Icons';
import colors from '../constants/colors';
import ImagePlaceholder from '../assets/png/imagePlaceholder.jpg';

export default function SellScreen() {
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
        <Text style={{color:'white', fontSize:10}}>Add Photo</Text>
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
          {/* <PhotoCard /> */}
          <FlatList
            horizontal
            data={products}
            renderItem={({item}) => <PhotoCard image={item.image} />}
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={{alignItems: 'center', paddingLeft: 10}}
            ListFooterComponent={<PhotoCardFooter />}
            ListFooterComponentStyle={{marginRight:10}}
          />
        </View>
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
    fontWeight: '500',
  },
  photosInnerContainer: {
    backgroundColor: 'white',
    height: '35%',
  },
});
