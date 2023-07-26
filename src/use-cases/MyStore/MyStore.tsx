/* eslint-disable react/no-unstable-nested-components */
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../resources/constants/Colors';
import tw from 'twrnc';
import {useTranslation} from 'react-i18next';
import {SecondHandSaleCard} from '../../components/MyStore/SecondHandSaleCard';
import {RouteNames} from '../../components/navigation/RouteNames';
import {
  INavigationType,
  IWithNavigation,
} from '../../components/navigation/Types';
import {useGetProductsByUserIdQuery} from '../../infrastructure/Service/ProductService';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';
import CommonHeader from '../../components/Common/CommonHeader';
type IMyStoreProps = IWithNavigation<RouteNames.myStore>;
const FavoritesTabScreen = React.memo(props => {
  const navigation = useNavigation<INavigationType>();
  return (
    <FlashList
      numColumns={2}
      data={props.favoriteProducts}
      renderItem={({item}) => (
        <SecondHandSaleCard
          onPress={() =>
            navigation.navigate(RouteNames.productInfo, {
              productId: item.id,
            })
          }
          onFavoritePress={props.handleFavPress}
          isFavorite={true}
          id={item.id}
          title={item.productHeader}
          price={item.price}
          image={item.productImages[0]}
          isMine={false}
        />
      )}
      estimatedItemSize={20}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={tw`pb-2 pt-2`}
    />
  );
});

const SoldTabScreen = props => {
  const navigation = useNavigation<INavigationType>();

  return (
    <FlashList
      numColumns={2}
      data={props.books}
      renderItem={({item}) => (
        <SecondHandSaleCard
          onPress={() =>
            navigation.navigate(RouteNames.productInfo, {
              productId: item.id,
            })
          }
          title={item.productHeader}
          price={item.price}
          image={item.productImages[0]}
          isMine={true}
          isSold={true}
        />
      )}
      estimatedItemSize={20}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={tw`pb-2 pt-2`}
    />
  );
};
const StoreTabScreen = props => {
  const navigation = useNavigation<INavigationType>();

  return (
    <FlashList
      numColumns={2}
      data={props.userProducts}
      renderItem={({item}) => (
        <SecondHandSaleCard
          title={item?.productHeader}
          price={item?.price}
          image={item?.productImages?.[0]}
          onPress={() =>
            navigation.navigate(RouteNames.productInfo, {
              productId: item?.id,
            })
          }
          isMine={true}
        />
      )}
      estimatedItemSize={20}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={tw`pb-2 pt-2`}
    />
  );
};

export const MyStore: React.FunctionComponent<IMyStoreProps> = props => {
  const {t} = useTranslation();
  const authUser = useAppSelector(store => store.user.user);
  const userId = props.route?.params?.id ?? authUser?.id;
  const isAuthUser = authUser?.id === userId;
  const {data: userProducts, isLoading} = useGetProductsByUserIdQuery(userId, {
    skip: !userId,
  });
  const [user, setUser] = useState(isAuthUser ? authUser : {});
  const [favoriteProducts, setFavoriteProducts] = React.useState([]);
  console.warn(userId);
  const getUserData = React.useCallback(
    async (userId: string) => {
      if (isAuthUser) {
        return setUser(authUser);
      }
      await database()
        .ref(`users/${userId}`)
        .once('value', snapshot => {
          setUser(snapshot.val());
        });
    },
    [authUser, isAuthUser],
  );
  const handleFavoritePress = React.useCallback(
    async id => {
      let favoriteProducts = user?.favoriteProducts ?? [];
      if (favoriteProducts.includes(id)) {
        favoriteProducts = favoriteProducts.filter(
          productId => productId !== id,
        );
      } else {
        favoriteProducts = [...favoriteProducts, id];
      }
      await database().ref(`users/${userId}`).update({
        favoriteProducts,
      });
    },
    [user?.favoriteProducts, userId],
  );
  React.useEffect(() => {
    // get favorite products by product id parallel from database
    const getFavoriteProducts = async () => {
      await getUserData(userId);
      console.warn(
        'user?.favoriteProducts ?? []',
        user?.favoriteProducts ?? [],
      );
      const _favoriteProducts = await Promise.all(
        (user?.favoriteProducts ?? [])?.map(async productId => {
          const product = await firestore()
            .collection('products')
            .doc(productId)
            .get();
          return {...product.data(), id: product.id};
        }),
      );
      if (favoriteProducts.length !== _favoriteProducts.length) {
        setFavoriteProducts(_favoriteProducts);
      }
    };
    getFavoriteProducts();
  }, [favoriteProducts.length, getUserData, user?.favoriteProducts, userId]);

  const [selectedScreen, setSelectedScreen] = useState(1);
  return (
    <View style={tw`flex-1 bg-white`}>
      <CommonHeader title={t('profile.my-store')} backDisabled={true} />
      <View style={tw` h-10 p-8`} />
      <View style={tw`p-4 mt-[-70]`}>
        <Image
          source={{uri: user?.imageUrl}}
          style={tw` w-25 h-25 rounded-full border-2 border-white`}
          resizeMode="cover"
        />
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={tw`text-lg w-30 font-semibold`}>
            {user?.name + ' ' + user?.lastName}
          </Text>
          {user.id === authUser?.id && (
            <TouchableOpacity
              style={tw` bg-white border-[${Colors.darkPurple}] border-2 px-2 h-10 justify-evenly items-center rounded-md shadow-md flex-row`}
              onPress={() => props.navigation.navigate(RouteNames.sellNow)}>
              <Icon name="add" size={25} color={Colors.darkPurple} />
              <Text style={tw`text-[${Colors.darkPurple}] font-semibold`}>
                {t('my-store.sell')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={tw`flex-row px-2 `}>
        <TouchableOpacity
          style={[
            selectedScreen === 1 && {
              paddingBottom: 5,
              borderBottomWidth: 2,
              borderBottomColor: Colors.darkPurple,
            },
            {
              flex: 1,
              alignItems: 'center',
            },
          ]}
          onPress={() => {
            setSelectedScreen(1);
          }}>
          <Text
            style={[
              selectedScreen === 1 && tw`text-[${Colors.darkPurple}] font-bold`,
              {fontWeight: '500'},
            ]}>
            My Store
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedScreen(2);
          }}
          style={[
            selectedScreen === 2 && {
              paddingBottom: 5,
              borderBottomWidth: 2,
              borderBottomColor: Colors.darkPurple,
            },
            {
              flex: 1,
              alignItems: 'center',
            },
          ]}>
          <Text
            style={[
              selectedScreen === 2 && tw`text-[${Colors.darkPurple}] font-bold`,
              ,
              {fontWeight: '500'},
            ]}>
            Favorites
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            selectedScreen === 3 && {
              paddingBottom: 5,
              borderBottomWidth: 2,
              borderBottomColor: Colors.darkPurple,
            },
            {
              flex: 1,
              alignItems: 'center',
            },
          ]}
          onPress={() => {
            setSelectedScreen(3);
          }}>
          <Text
            style={[
              selectedScreen === 3 && tw`text-[${Colors.darkPurple}] font-bold`,
              ,
              {fontWeight: '500'},
            ]}>
            Sold
          </Text>
        </TouchableOpacity>
      </View>
      {selectedScreen === 1 ? (
        <StoreTabScreen userProducts={userProducts} />
      ) : selectedScreen === 2 ? (
        <FavoritesTabScreen
          favoriteProducts={favoriteProducts}
          handleFavPress={handleFavoritePress}
        />
      ) : (
        <SoldTabScreen
          books={userProducts?.filter(product => product?.isSold)}
        />
      )}
    </View>
  );
};
