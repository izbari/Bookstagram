import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../resources/constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import tw from 'twrnc'
// import {RadioButton, Switch} from 'react-native-paper';
import {RouteNames} from '../../components/navigation/RouteNames';
import {IWithNavigation} from '../../components/navigation/Types';
type ISellNowProps = IWithNavigation<RouteNames.sellNow>;

export const SellNow: React.FunctionComponent<ISellNowProps> = props => {
  const {t} = useTranslation();
  const [productHeader, setProductHeader] = useState('');
  const [productAuthor, setProductAuthor] = useState('');
  const [productExplanation, setProductExplanation] = useState('');
  const [checked, setChecked] = React.useState('');
  const [pageCount, setPageCount] = useState();
  const [price, setPrice] = useState();
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  // let categories = [
  //   'Fantasy',
  //   'Adventure',
  //   'Diary',
  //   'Crime',
  //   'Mystery',
  //   'Horror',
  //   'Thriller',
  //   'Paranormal',
  //   'Historical fiction',
  //   'Science Fiction',
  //   'Memoir',
  //   'Cooking',
  //   'Art',
  //   'Poetry',
  //   'Development',
  //   'Motivational',
  //   'Health',
  //   'History',
  //   'Travel',
  //   'Drama',
  //   'Families & Relationships',
  //   'Humor',
  //   'Children',
  //   'Business',
  //   'Other',
  // ];

  const PhotoCard = ({image}) => {
    return (
      <>
        <Image
          source={{uri: image}}
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
        <Icon name="add" size={50} color="white" />
        <Text style={{color: 'white', fontSize: 10}}>{t('product-info.add-photo')}</Text>
      </TouchableOpacity>
    );
  };

  const products = [];
  
  // const products = [
  //   {
  //     image:
  //       'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
  //   },
  //   {
  //     image:
  //       'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
  //   },
  //   {
  //     image:
  //       'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
  //   },
  //   {
  //     image:
  //       'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
  //   },
  //   {
  //     image:
  //       'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
  //   },
  //   {
  //     image:
  //       'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
  //   },
  // ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={25} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t('product-info.product-info')}</Text>
      </View>
      <ScrollView>
        <View>
          <View style={styles.photosHeader}>
            <View
                style={tw	`flex-row items-center justify-between w-1/3.5`}>
              <Text style={{fontWeight: '600'}}>{t('product-info.photos')}</Text>
              <Text style={{fontSize: 12}}>{products.length}/10</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editText}>{t('product-info.edit')}</Text>
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

        <Text style={styles.infoHeader}>{t('product-info.book-header')}</Text>
        <TextInput
          value={productHeader}
          onChangeText={setProductHeader}
          style={styles.infoInput}
          placeholder="Write the name of the book you are selling"
          placeholderTextColor="#AEAEAE"
        />

        <Text style={styles.infoHeader}>{t('product-info.book-author')}</Text>
        <TextInput
          value={productAuthor}
          onChangeText={setProductAuthor}
          style={styles.infoInput}
          placeholder="Write the author of the book you are selling"
          placeholderTextColor="#AEAEAE"
        />

        <Text style={styles.infoHeader}>{t('product-info.product-explanation')}</Text>
        <TextInput
          value={productExplanation}
          onChangeText={setProductExplanation}
          style={styles.infoInput}
          placeholder="Explain the product you are selling in detail"
          placeholderTextColor="#AEAEAE"
          numberOfLines={3}
        />

        <TouchableOpacity style={[styles.touchableInput, {marginTop: 20}]}>
          <Text style={{fontWeight: '600'}}>{t('product-info.category')}</Text>
          <Icon
            name="caret-forward-outline"
            size={25}
            color={Colors.darkPurple}></Icon>
        </TouchableOpacity>
        <Text style={styles.infoHeader}>{t('product-info.condition')}</Text>
        <View style={styles.conditionContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <RadioButton.Android
              value="worn"
              status={checked === 'worn' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('worn')}
              color={Colors.darkPurple}
              uncheckedColor={Colors.darkPurple}
            /> */}
            <Text>{t('product-info.worn')}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <RadioButton.Android
              value="lessUsed"
              status={checked === 'lessUsed' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('lessUsed')}
              color={Colors.darkPurple}
              uncheckedColor={Colors.darkPurple}
            /> */}
            <Text>{t('product-info.less-used')}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <RadioButton.Android
              value="new"
              status={checked === 'new' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('new')}
              color={Colors.darkPurple}
              uncheckedColor={Colors.darkPurple}
            /> */}
            <Text>{t('product-info.new')}</Text>
          </View>
        </View>
        <View
          style={[styles.touchableInput, {marginTop: 20, paddingVertical: 20}]}>
          <Text style={{fontWeight: '600'}}>{t('product-info.page-count')}</Text>
          <TextInput
            style={{
              width: 50,
              textAlign: 'center',
              borderBottomWidth: 1,
              borderBottomColor: 'lightgray',
            }}
            value={pageCount}
            onChangeText={setPageCount}
            keyboardType="numeric"
          />
        </View>
        <View
          style={[styles.touchableInput, {marginTop: 20, paddingVertical: 20}]}>
          <Text style={{fontWeight: '600'}}>{t('product-info.price')}</Text>
          <TextInput
            style={{
              width: 50,
              textAlign: 'center',
              borderBottomWidth: 1,
              borderBottomColor: 'lightgray',
            }}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        </View>

        <View
          style={[styles.touchableInput, {marginTop: 20, paddingVertical: 20}]}>
          <Text>{t('product-info.book-swap-text')}</Text>
          {/* <Switch
            value={isSwitchOn}
            onValueChange={() => setIsSwitchOn(!isSwitchOn)}
            color={Colors.darkPurple}
          /> */}
        </View>

        <TouchableOpacity style={styles.sellButton}>
          <Text style={styles.sellText}>{t('product-info.sell-now').toUpperCase()}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

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
    color: 'black',
  },
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
    color: Colors.darkPurple,
    fontWeight: '600',
  },
  photosInnerContainer: {
    backgroundColor: 'white',
  },
  infoHeader: {
    fontWeight: '600',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 20,
  },
  infoInput: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  touchableInput: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
  },
  conditionContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingRight: 20,
  },
  sellButton: {
    backgroundColor: Colors.darkPurple,
    marginVertical: 35,
    marginHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4.65,
    elevation: 6,
  },
  sellText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
