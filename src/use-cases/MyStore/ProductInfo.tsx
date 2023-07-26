import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import PagerView from 'react-native-pager-view';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {RouteNames} from '../../components/navigation/RouteNames';
import {IWithNavigation} from '../../components/navigation/Types';
import {useGetProductByIdQuery} from '../../infrastructure/Service/ProductService';
import moment from 'moment';
import {Colors} from '../../resources/constants/Colors';
import CommonHeader from '../../components/Common/CommonHeader';
import database from '@react-native-firebase/database';
import {IUser} from '../../infrastructure/Redux/Slices/UserSlice';
import {guidGenerator} from '../../infrastructure/Utils/guidGenerator';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import firestore from '@react-native-firebase/firestore';
import {RenderStar} from '../BookDetail/BookDetail';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
type IProductInfoProps = IWithNavigation<RouteNames.productInfo>;
export type IBook = {
  isTradable: boolean;
  price: string;
  productImages: string[];
  pageCount: string;
  productHeader: string;
  categories: string[];
  productExplanation: string;
  condition: string;
  productAuthor: string;
  id: string;
  createdAt: Date;
  userId: string;
};
export const ProductInfo: React.FunctionComponent<
  IProductInfoProps
> = props => {
  const {t} = useTranslation();
  const authUser = useAppSelector(store => store.user.user);
  const productId = props.route.params.productId;
  const [currentIndex, setCurrentIndex] = useState(0);
  const {
    data: productData,
    isLoading,
    refetch,
  } = useGetProductByIdQuery(productId, {
    skip: !productId,
  });
  const [productUser, setProductUser] = useState({} as IUser);
  const getProductUser = React.useCallback(() => {
    database()
      .ref(`/users/${productData?.userId}`)
      .once('value', snapshot => {
        setProductUser(snapshot.val());
      });
  }, [productData?.userId]);
  React.useEffect(() => {
    getProductUser();
  }, [getProductUser]);
  const handleLike = async (id: string) => {
    try {
      const favoriteProduct = authUser?.favoriteProducts ?? [];
      const handledFavoriteProducts = favoriteProduct?.includes?.(id)
        ? favoriteProduct?.filter?.(productId => productId !== id)
        : [...favoriteProduct, id];
      await database()
        .ref(`users/${authUser?.id}`)
        .update({favoriteProducts: handledFavoriteProducts});
    } catch (error) {
      Alert.alert('Something went wrong...' + error);
    }
  };
  const handleSold = () => {
    if (productData?.isSold) {
      return;
    } else {
      firestore().doc(`products/${productData.id}`).update({isSold: true});
      refetch();
    }
  };

  const isMine = productData?.userId !== authUser?.id;
  if (isLoading) {
    return <ActivityIndicator size={'small'} color={Colors.lightPurple} />;
  }
  return (
    <View style={tw`flex-1 bg-white`}>
      <CommonHeader
        title={productData?.productHeader}
        right={
          isMine && (
            <TouchableOpacity
              style={tw`absolute right-3 top-2`}
              onPress={() => handleLike(productData.id)}>
              <Icon
                name={
                  authUser?.favoriteProducts?.includes?.(productData.id)
                    ? 'heart'
                    : 'heart-outline'
                }
                size={30}
                color="white"
              />
            </TouchableOpacity>
          )
        }
      />
      {/* <View style={tw`absolute z-2 flex-row justify-between w-full top-0`}>
        <TouchableOpacity style={tw`p-1`}>
          <Icon name="chevron-back" size={30} color="white" />
        </TouchableOpacity>
        <View style={tw`flex-row mr-3`}>
          <TouchableOpacity style={tw`p-1 mr-2`}>
            <Icon name="share-outline" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={tw`p-1`}>
            <Icon name="heart-circle-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View> */}
      <PagerView
        style={tw`h-60 mb-2`}
        initialPage={0}
        onPageScroll={e => {
          setCurrentIndex(e.nativeEvent.position);
        }}>
        {productData.productImages?.map((image, index) => {
          return (
            <Image
              key={index}
              source={{uri: image}}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          );
        })}
      </PagerView>
      <View style={tw`z-6 h-6 w-full mt-[-30] mb-3`}>
        {productData.productImages?.length > 1 && (
          <View style={tw`flex-row justify-center items-center`}>
            {productData.productImages?.map((_, index) => {
              return (
                <View
                  key={index}
                  style={tw`h-2 w-2 rounded-full m-1 ${
                    index === currentIndex ? 'bg-gray-500' : 'bg-gray-200'
                  }`}></View>
              );
            })}
          </View>
        )}
      </View>
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        <View style={tw`p-3 pt-1`}>
          <View style={tw`flex-row items-center mb-2`}>
            <Icon name="time" size={20} color="lightgray" style={tw`pr-1`} />
            <Text style={tw`text-gray-400`}>
              {moment(productData.createdAt?.toDate?.()).fromNow()}
            </Text>
          </View>
          <Text style={tw`text-black text-xl font-semibold`}>
            {productData.productHeader}
          </Text>
          <View style={tw`flex-row mb-2`}>
            <Text style={tw`mr-2 text-black pb-2`}>
              {productData.productAuthor}
            </Text>
          </View>
          <View style={tw`flex-row flex-wrap w-full`}>
            {productData.categories?.map((category, index) => {
              return (
                <Text
                  key={index}
                  style={tw`border rounded-2xl p-1 px-2 border-gray-700 mr-1 mb-1.5 text-gray-700 `}>
                  {category}
                </Text>
              );
            })}
          </View>
          <View style={tw`flex-row items-center mt-2 mb-3`}>
            <Icon
              name="pricetag-outline"
              size={17}
              color="gray"
              style={tw`pr-1`}
            />
            <Text style={tw`text-gray-700 ml-1 mr-5`}>
              {productData.condition === 'new'
                ? t('product-info.new')
                : productData.condition === 'less-used'
                ? t('product-info.less-used')
                : t('product-info.worn')}
            </Text>
            <Icon name="book-outline" size={17} color="gray" style={tw`pr-1`} />
            <Text style={tw`text-black ml-1`}>
              {productData.pageCount} {t('product-info.pages')}
            </Text>
          </View>
          <Text style={tw`text-black`}>{productData.productExplanation}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate(RouteNames.myStore, {
              id: productData.userId,
            });
          }}
          activeOpacity={0.8}
          style={tw`bg-gray-100 justify-between items-center rounded-md p-4 m-2 shadow-md flex-row my-6`}>
          <View style={tw`flex-row`}>
            <Image
              source={{uri: productUser?.imageUrl}}
              style={tw`h-14 w-14 rounded-full`}
            />
            <View style={tw`px-4 gap-1`}>
              <Text style={tw`font-bold`}>
                {productUser?.name + ' ' + productUser?.lastName}
              </Text>
              <Text style={tw`text-gray-600 text-xs`}>
                {moment(auth().currentUser?.metadata.lastSignInTime).fromNow() +
                  ' active'}
              </Text>
              <View style={tw`flex-row items-center`}>
                <RenderStar averageRating={Math.random() * 5} />
                <Text style={tw`text-gray-500`}>
                  ({(Math.random() * 40).toFixed(0)})
                </Text>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={25} color="gray" />
        </TouchableOpacity>
      </ScrollView>
      <View
        style={tw`w-full bg-white absolute bottom-0  flex-row justify-between items-center p-4 border border-gray-200`}>
        <Text style={tw`text-black text-xl font-semibold`}>
          {productData.price} TL
        </Text>
        {isMine ? (
          <View style={tw`flex-row gap-2`}>
            {productData.isTradable && (
              <TouchableOpacity
                style={tw`bg-white rounded-2xl p-2 px-4 border border-[${Colors.darkPurple}] `}
                onPress={() => {
                  props.navigation.navigate(RouteNames.singleChat, {
                    name: productUser?.name + ' ' + productUser?.lastName,
                    avatar: productUser?.imageUrl,
                    targetUserId: productData?.userId,
                    chatId: undefined,
                    isFromBookStore: true,
                    bookMessage: {
                      _id: guidGenerator(),
                      createdAt: new Date(),
                      bookImage: productData.productImages[0],
                      user: {
                        _id: authUser?.id,
                        name: authUser?.name + ' ' + authUser?.lastName,
                        avatar: authUser?.imageUrl,
                      },
                      bookTitle: productData.productHeader,
                      bookPrice: productData.price,
                      isBook: true,
                      bookId: productData.productId,
                      pending: false,
                      sent: true,
                      received: false,
                      tradeText: 'Bu ürün ile takas yapmak istiyorum.',
                    },
                  });
                }}>
                <Text style={tw`text-[${Colors.darkPurple}] font-semibold`}>
                  {t('product-info.swap-offer')}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate(RouteNames.singleChat, {
                  name: productUser?.name + ' ' + productUser?.lastName,
                  avatar: productUser?.imageUrl,
                  targetUserId: productData?.userId,
                  chatId: undefined,
                  isFromBookStore: true,
                  bookMessage: {
                    _id: guidGenerator(),
                    createdAt: new Date(),
                    bookImage: productData.productImages[0],
                    user: {
                      _id: authUser?.id,
                      name: authUser?.name + ' ' + authUser?.lastName,
                      avatar: authUser?.imageUrl,
                    },
                    bookTitle: productData.productHeader,
                    bookPrice: productData.price,
                    isBook: true,
                    bookId: productData.productId,
                    pending: false,
                    sent: true,
                    received: false,
                  },
                })
              }
              style={tw`bg-[${Colors.darkPurple}] rounded-2xl p-2 px-4`}
              // onPress={() => {
              //   props.navigation.navigate(RouteNames.chat, {
              //     productId: productData.id,
              //   });
              // }}
            >
              <Text style={tw`text-white font-semibold`}>
                {t('product-info.ask-question')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            disabled={productData?.isSold}
            onPress={handleSold}
            style={tw`bg-white rounded-2xl p-2 px-4 border border-[${Colors.darkPurple}] `}>
            <Text style={tw`text-[${Colors.darkPurple}] font-semibold`}>
              {productData?.isSold ? 'Satıldı' : 'Satıldı olarak işaretle'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
