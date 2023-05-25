import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../resources/constants/Colors';
import tw from 'twrnc';
const {width} = Dimensions.get('window');

export const SecondHandSaleCard = ({image, title, price, isMine, isSold}) => {
  return (
    <>
      <TouchableOpacity style={styles.container}>
          <ImageBackground source={image} style={styles.image} resizeMode="cover" imageStyle={tw`rounded-md`}>
          {!isMine && (
            <TouchableOpacity style={styles.favoriteContainer}>
              <Icon name="heart-outline" size={20} color={Colors.lightPurple} />
            </TouchableOpacity>
          )}

          {isSold && <Text style={styles.soldText}>SOLD</Text>}
          </ImageBackground>
        

        {isMine ? (
          <View style={styles.titleAndFavoriteContainer}>
            <Text style={styles.title}>{title}</Text>
            <Icon name="FilledLike" size={16} fill={Colors.lightPurple} />
            <Text style={styles.favoriteCount}>10</Text>
          </View>
        ) : (
          <Text style={[styles.title, {marginTop: 5}]}>{title}</Text>
        )}
        <Text style={styles.price}>{price}</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    marginTop: 10,
    flex:1
  },
  image: {
    height: 190,
    borderRadius: 10,
  },
  favoriteContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    top: 8,
    right: 8,
    elevation: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 4.65,
  },
  title: {
    alignSelf: 'flex-start',
    fontSize: 14,
    width: '78%',
    paddingRight: 5,
  },
  price: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginTop: 20,
    fontSize: 16,
  },
  soldText: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 20,
    backgroundColor: 'black',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    textAlign: 'center',
    fontSize: 11,
    color: 'white',
    fontWeight: '400',
    textAlignVertical: 'center',
  },
  titleAndFavoriteContainer: {
    flexDirection: 'row',
    width: width / 2 - 36,
    justifyContent: 'space-between',
    textAlign: 'center',
    marginTop: 5,
    alignItems: 'center',
  },
  favoriteCount: {
    fontSize: 13,
  },
});
