import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
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
type IProductInfoProps = IWithNavigation<RouteNames.productInfo>;

export const ProductInfo: React.FunctionComponent<
  IProductInfoProps
> = props => {
  const {t} = useTranslation();
  const productId = props.route.params.productId;
  const [currentIndex, setCurrentIndex] = useState(0);
  const {data, isLoading} = useGetProductByIdQuery(productId, {
    skip: !productId,
  });

  const productData: {
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
  } = JSON.parse(JSON.stringify(data ?? {}, null, 2));

  console.warn('userId', productData.id);
  if (isLoading) return <ActivityIndicator />;
  return (
    <View style={tw`flex-1 bg-white`}>
      <View style={tw`absolute z-2 flex-row justify-between w-full top-0`}>
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
      </View>
      <PagerView
        style={tw`h-60 mb-2`}
        initialPage={0}
        onPageScroll={e => {
          setCurrentIndex(e.nativeEvent.position);
        }}>
        {productData.productImages.map((image, index) => {
          return (
            <>
              <Image
                key={index}
                source={{uri: image}}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            </>
          );
        })}
      </PagerView>
      <View style={tw`z-6 h-6 w-full`}>
        {productData.productImages.length > 1 && (
          <View style={tw`flex-row justify-center items-center`}>
            {productData.productImages.map((_, index) => {
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
          <Text style={tw`mr-2 text-black`}>{productData.productAuthor}</Text>
        </View>
        <View style={tw`flex-row flex-wrap w-full`}>
          {productData.categories.map((category, index) => {
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
      <View
        style={tw`absolute bottom-0 w-full flex-row justify-between items-center p-4 border border-gray-200`}>
        <Text style={tw`text-black text-xl font-semibold`}>
          {productData.price} TL
        </Text>
        {productData.isTradable && (
          <TouchableOpacity
            style={tw`bg-white rounded-2xl p-2 px-4 border border-[${Colors.darkPurple}] ml-20`}
            // onPress={() => {
            //   props.navigation.navigate(RouteNames.chat, {
            //     productId: productData.id,
            //   });
            // }}
          >
            <Text style={tw`text-[${Colors.darkPurple}] font-semibold`}>
              {t('product-info.swap-offer')}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
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
    </View>
  );
};
