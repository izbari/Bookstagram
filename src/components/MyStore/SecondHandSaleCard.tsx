import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../resources/constants/Colors';
import tw from 'twrnc';
import {useTranslation} from 'react-i18next';
import {INavigationType} from '../navigation/Types';
import {useNavigation} from '@react-navigation/native';
import isEqual from 'react-fast-compare';
const {width} = Dimensions.get('window');

interface ISeconHandSaleCardProps {
  readonly image: string;
  readonly title: string;
  readonly price: string;
  readonly isMine?: boolean;
  readonly isSold?: boolean;
  readonly onFavoritePress?: () => void;
  readonly isFavorite?: boolean;
  readonly onPress?: () => void;
}

export const SecondHandSaleCard: React.FunctionComponent<ISeconHandSaleCardProps> =
  React.memo(props => {
    const {t} = useTranslation();
    const navigation = useNavigation<INavigationType>();
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity style={styles.container} onPress={props.onPress}>
          <ImageBackground
            source={{uri: props.image}}
            style={styles.image}
            resizeMode="cover"
            imageStyle={tw`rounded-md`}>
            {!props.isMine && (
              <TouchableOpacity
                onPress={() => props.onFavoritePress(props.id)}
                style={styles.favoriteContainer}>
                <Icon
                  name={props.isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                  color={Colors.lightPurple}
                />
              </TouchableOpacity>
            )}

            {props.isSold && (
              <Text style={styles.soldText}>{t('my-store.sold-text')}</Text>
            )}
          </ImageBackground>

          {props.isMine ? (
            <View style={tw`flex-row mt-1`}>
              <Text style={styles.title}>{props.title}</Text>
              <Icon name="heart" size={16} color={Colors.lightPurple} />
              <Text style={styles.favoriteCount}>10</Text>
            </View>
          ) : (
            <Text style={[styles.title, {marginTop: 5}]}>{props.title}</Text>
          )}
          <Text style={styles.price}>{props.price} TL</Text>
        </TouchableOpacity>
      </View>
    );
  }, isEqual);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    marginTop: 10,
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
    paddingVertical: 5,
    backgroundColor: 'black',
    textAlign: 'center',
    fontSize: 11,
    color: 'white',
    fontWeight: '400',
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
