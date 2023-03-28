import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Icon from '../components/Icons';
import colors from '../constants/colors';
import ImagePlaceholder from '../assets/png/imagePlaceholder.jpg';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {RadioButton, Switch} from 'react-native-paper';

export default function SellScreen() {
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

  const ProductInfoInput = ({
    header,
    value,
    onChangeText,
    placeholder,
    numberOfLines,
    multiline,
    style,
  }) => {
    return (
      <View>
        <Text style={styles.infoHeader}>{header}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.infoInput, style]}
          numberOfLines={numberOfLines ? numberOfLines : 2}
          placeholder={placeholder}
          placeholderTextColor="#AEAEAE"
        />
      </View>
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
      <ScrollView>
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

        <ProductInfoInput
          header="Book Header"
          value={productHeader}
          onChangeText={setProductHeader}
          placeholder="Write the name of the book you are selling"
        />

        <ProductInfoInput
          header="Book Author"
          value={productAuthor}
          onChangeText={setProductAuthor}
          placeholder="Write the author of the book you are selling"
        />

        <ProductInfoInput
          header="Product Explanation"
          value={productExplanation}
          onChangeText={setProductExplanation}
          placeholder="Explain the product you are selling in detail"
          numberOfLines={3}
          style={{height: 70}}
        />

        <TouchableOpacity
          style={[
            styles.touchableInput,
            {
              marginTop: 20,
            },
          ]}>
          <Text>Category</Text>
          <Ionicon
            name="caret-forward-outline"
            size={25}
            color={colors.darkPurple}></Ionicon>
        </TouchableOpacity>
        <Text style={styles.infoHeader}>Condition</Text>
        <View style={styles.conditionContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioButton.Android
              value="worn"
              status={checked === 'worn' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('worn')}
              color={colors.darkPurple}
              uncheckedColor={colors.darkPurple}
            />
            <Text>Worn</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioButton.Android
              value="lessUsed"
              status={checked === 'lessUsed' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('lessUsed')}
              color={colors.darkPurple}
              uncheckedColor={colors.darkPurple}
            />
            <Text>Less Used</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RadioButton.Android
              value="new"
              status={checked === 'new' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('new')}
              color={colors.darkPurple}
              uncheckedColor={colors.darkPurple}
            />
            <Text>New</Text>
          </View>
        </View>
        <View
          style={[styles.touchableInput, {marginTop: 20, paddingVertical: 20}]}>
          <Text>Page Count</Text>
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
          <Text>Price</Text>
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
          <Text>I am open to book swap offers</Text>
          <Switch
            value={isSwitchOn}
            onValueChange={() => setIsSwitchOn(!isSwitchOn)}
            color={colors.darkPurple}
          />
        </View>

        <TouchableOpacity style={styles.sellButton}>
          <Text style={styles.sellText}>SELL NOW</Text>
        </TouchableOpacity>
      </ScrollView>
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
  infoHeader: {
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
    backgroundColor: colors.darkPurple,
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
