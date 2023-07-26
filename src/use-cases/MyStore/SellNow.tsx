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
  Platform,
  Switch,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../resources/constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import tw from 'twrnc';
import ImagePicker from 'react-native-image-crop-picker';
// import {RadioButton, Switch} from 'react-native-paper';
import {RouteNames} from '../../components/navigation/RouteNames';
import {IWithNavigation} from '../../components/navigation/Types';
import firestore from '@react-native-firebase/firestore';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import {guidGenerator} from '../../infrastructure/Utils/guidGenerator';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import CommonHeader from '../../components/Common/CommonHeader';

type ISellNowProps = IWithNavigation<RouteNames.sellNow>;

export const SellNow: React.FunctionComponent<ISellNowProps> = props => {
  const {t} = useTranslation();
  const user = useAppSelector(store => store.user.user);
  const [productHeader, setProductHeader] = useState('');
  const [productAuthor, setProductAuthor] = useState('');
  const [productExplanation, setProductExplanation] = useState('');
  const [checked, setChecked] = React.useState('');
  const [pageCount, setPageCount] = useState('');
  const [price, setPrice] = useState('');
  const [productImages, setProductImages] = React.useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [condition, setCondition] = useState('');
  const categories = props.route.params?.categories ?? [];
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const PhotoCard = ({image}) => {
    return (
      <>
        <Image
          source={{uri: image}}
          // style={{width: 100, height: 100, borderRadius: 10, marginRight: 10}}
          style={tw`rounded-lg w-25 h-25 mr-2`}
          resizeMode="cover"
        />
        {isEditable && (
          <TouchableOpacity
            style={tw`absolute top-[-1.5] right-1 z-2 bg-gray-400 rounded-full`}
            onPress={() => {
              setProductImages(productImages.filter(img => img !== image));
            }}>
            <Icon name="close-outline" size={18} color="white" />
          </TouchableOpacity>
        )}
      </>
    );
  };

  const takePhotoByCamera = () => {
    setIsEditable(false);
    ImagePicker.openCamera({
      width: 1080,
      height: 1920,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        const imageUri = Platform.OS !== 'ios' ? image.sourceURL : image.path;
        setProductImages([...productImages, imageUri]);
        console.log('productImages', productImages);
      })
      .catch(err => {
        console.log(err.msg);
      });
  };

  const PhotoCardFooter = () => {
    return (
      <TouchableOpacity
        onPress={takePhotoByCamera}
        style={tw`w-25 h-25 bg-gray-400 rounded-lg items-center justify-center`}>
        <Icon name="add" size={50} color="white" />
        <Text style={{color: 'white', fontSize: 10}}>
          {t('product-info.add-photo')}
        </Text>
      </TouchableOpacity>
    );
  };

  const uploadPhotos = async () => {
    try {
      const uploadPromises = productImages.map(async image => {
        const reference = storage().ref(`product-images/${guidGenerator()}`);
        await reference.putFile(image);
        return reference.getDownloadURL();
      });
      const photoUrls = await Promise.all(uploadPromises);
      // photoUrls.length > 0 &&s
      handleSaveProduct(photoUrls);
    } catch (error) {
      Alert.alert(('Error' + error) as string);
    }
  };

  const handleSaveProduct = async (photoUrls: string[]): Promise<void> => {
    const product = {
      productImages: photoUrls,
      productHeader,
      productAuthor,
      productExplanation,
      pageCount,
      price,
      condition,
      categories,
      isTradable: isEnabled,
      createdAt: new Date(),
      userId: user?.id,
    };
    console.warn('product', product);
    firestore()
      .collection('products')
      .add(product)
      .then(docRef => {
        console.log('Document written with ID: ', docRef.id);
        props.navigation.navigate(RouteNames.productInfo, {
          productId: docRef.id,
        });
        database()
          .ref('users/' + user?.id + '/products')
          .push(docRef.id);
      })
      .catch(error => {
        console.log('Error adding document: ', error);
      });
  };
  return (
    <View style={tw`flex-1`}>
      {/* <View style={tw`bg-white shadow-lg h-[10%] items-center justify-center `}>
        <TouchableOpacity
          style={tw`absolute top-0 left-0 h-full justify-center pl-1`}
          onPress={() => {
            setProductImages([]);
            setIsEditable(false);
            props.navigation.navigate(RouteNames.myStore);
          }}>
          <Icon name="chevron-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={tw`font-semibold text-base text-black`}>
          {t('product-info.product-info')}
        </Text>
      </View> */}
      <CommonHeader title={t('product-info.product-info')} />
      <KeyboardAwareScrollView contentContainerStyle={tw`mb-12`}>
        <View>
          <View style={styles.photosHeader}>
            <View style={tw`flex-row items-center justify-between w-1/3.5`}>
              <Text style={{fontWeight: '600'}}>
                {t('product-info.photos')}
              </Text>
              <Text style={{fontSize: 12}}>{productImages.length}/10</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditable(!isEditable)}>
              <Text style={styles.editText}>{t('product-info.edit')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.photosInnerContainer}>
            <FlatList
              horizontal
              data={productImages}
              renderItem={({item}) => <PhotoCard image={item} />}
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={{alignItems: 'center', padding: 10}}
              ListFooterComponent={
                productImages.length < 10 && <PhotoCardFooter />
              }
              ListFooterComponentStyle={{marginRight: 10}}
            />
          </View>
        </View>

        <Text style={styles.infoHeader}>{t('product-info.book-header')}</Text>
        <TextInput
          value={productHeader}
          onChangeText={setProductHeader}
          style={styles.infoInput}
          placeholder={t('product-info.book-header-placeholder')}
          placeholderTextColor="#AEAEAE"
        />

        <Text style={styles.infoHeader}>{t('product-info.book-author')}</Text>
        <TextInput
          value={productAuthor}
          onChangeText={setProductAuthor}
          style={styles.infoInput}
          placeholder={t('product-info.book-author-placeholder')}
          placeholderTextColor="#AEAEAE"
        />

        <Text style={styles.infoHeader}>
          {t('product-info.product-explanation')}
        </Text>
        <TextInput
          value={productExplanation}
          onChangeText={setProductExplanation}
          style={styles.infoInput}
          placeholder={t('product-info.product-explanation-placeholder')}
          placeholderTextColor="#AEAEAE"
          numberOfLines={5}
          multiline={true}
        />

        <TouchableOpacity
          style={[styles.touchableInput, {marginTop: 20}]}
          onPress={() => props.navigation.navigate(RouteNames.selectCategory)}>
          <Text style={{fontWeight: '600'}}>{t('product-info.category')}</Text>
          {props.categories &&
            props.categories.map(category => (
              <Text style={{color: 'gray'}}>{category}</Text>
            ))}

          <Icon
            name="caret-forward-outline"
            size={25}
            color={Colors.darkPurple}></Icon>
        </TouchableOpacity>
        <Text style={styles.infoHeader}>{t('product-info.condition')}</Text>
        <View style={styles.conditionContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={tw`mr-2`}
              onPress={() => setCondition('worn')}>
              <Icon
                name={
                  condition === 'worn'
                    ? 'radio-button-on-outline'
                    : 'radio-button-off-outline'
                }
                size={25}
                color={Colors.darkPurple}
              />
            </TouchableOpacity>
            <Text>{t('product-info.worn')}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={tw`mr-2`}
              onPress={() => setCondition('less-used')}>
              <Icon
                name={
                  condition === 'less-used'
                    ? 'radio-button-on-outline'
                    : 'radio-button-off-outline'
                }
                size={25}
                color={Colors.darkPurple}
              />
            </TouchableOpacity>
            <Text>{t('product-info.less-used')}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={tw`mr-2`}
              onPress={() => setCondition('new')}>
              <Icon
                name={
                  condition === 'new'
                    ? 'radio-button-on-outline'
                    : 'radio-button-off-outline'
                }
                size={25}
                color={Colors.darkPurple}
              />
            </TouchableOpacity>
            <Text>{t('product-info.new')}</Text>
          </View>
        </View>
        <View
          style={[styles.touchableInput, {marginTop: 20, paddingVertical: 20}]}>
          <Text style={{fontWeight: '600'}}>
            {t('product-info.page-count')}
          </Text>
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
          <Switch
            trackColor={{false: 'lightgray', true: Colors.lightPurple}}
            thumbColor={isEnabled ? 'white' : '#ededed'}
            ios_backgroundColor={'white'}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        <TouchableOpacity style={styles.sellButton} onPress={uploadPhotos}>
          <Text style={styles.sellText}>
            {t('product-info.sell-now').toUpperCase()}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexWrap: 'wrap',
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
