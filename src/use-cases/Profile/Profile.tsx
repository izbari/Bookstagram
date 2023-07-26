import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import tw from 'twrnc';
import {Colors} from '../../resources/constants/Colors';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import {RouteNames} from '../../components/navigation/RouteNames';
import {IWithNavigation} from '../../components/navigation/Types';
import {IPost} from '../../infrastructure/Service/PostService';
import CommonHeader from '../../components/Common/CommonHeader';
import database from '@react-native-firebase/database';
type IProfileMainProps = IWithNavigation<RouteNames.profileMain>;

//import i18n from 'i18next'
export const Profile: React.FunctionComponent<IProfileMainProps> = props => {
  const {t} = useTranslation();
  const authUser = useAppSelector(store => store.user.user);
  const userId = props.route?.params?.id ?? authUser?.id;
  const isAuthUser = authUser?.id === userId;
  const [posts, setPosts] = useState<IPost>([]);
  const [user, setUser] = useState(isAuthUser ? authUser : {});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);

  const getPostsByUserId = React.useCallback(async (userId: string) => {
    if (!userId) return console.warn('userId is undefined');
    setIsLoading(true);
    const posts: IPost[] = [];
    const postRef = firestore().collection('posts');
    const response = await postRef.where('userId', '==', userId).get();
    response?.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
      posts.push({...(doc.data() as IPost), id: doc.id});
    });
    setPosts(posts);
    setIsLoading(false);
  }, []);
  const getUserData = React.useCallback(
    async (userId: string) => {
      setIsLoading2(true);
      if (isAuthUser) {
        setIsLoading2(false);
        return setUser(authUser);
      }
      await database()
        .ref(`users/${userId}`)
        .once('value', snapshot => {
          setUser(snapshot.val());
        })
        .finally(() => setIsLoading2(false));
    },
    [authUser, isAuthUser],
  );
  const handleFollow = () => {
    if (!authUser) {
      return;
    }
    console.warn('user?.fallowers', user?.fallowers);
    console.warn('authUser?.fallowing', authUser?.fallowing);

    if (authUser?.fallowing?.includes?.(userId)) {
      database()
        .ref(`users/${authUser?.id}`)
        .update({
          fallowing: authUser?.fallowing?.filter?.(id => id !== userId) ?? [],
        });
      database()
        .ref(`users/${userId}`)
        .update({
          fallowers: user?.fallowers?.filter?.(id => id !== authUser?.id) ?? [],
        });
    } else {
      console.warn('else', authUser?.fallowing ?? [], user?.fallowers ?? []);
      database()
        .ref(`users/${authUser?.id}`)
        .update({
          fallowing: [...(authUser?.fallowing ?? []), userId],
        });
      database()
        .ref(`users/${userId}`)
        .update({
          fallowers: [...(user?.fallowers ?? []), authUser?.id],
        });
    }
  };
  useEffect(() => {
    getPostsByUserId(userId);
    getUserData(userId);
  }, [getPostsByUserId, getUserData, userId]);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <CommonHeader title={'Profile'} />
      {isLoading || isLoading2 ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={tw`m-4`}>
          <View style={tw`flex-row items-center`}>
            <Image
              resizeMode="contain"
              style={tw`w-20 h-20 rounded-full overflow-hidden bg-black`}
              source={{
                uri: user ? user.imageUrl : 'https://picsum.photos/200',
              }}
            />
            <View style={tw`flex-row ml-10`}>
              <TouchableOpacity style={tw`mr-5`}>
                <Text style={tw`text-base font-bold mx-4`}>
                  {!!user ? user.books?.length : '0'}
                </Text>
                <Text style={tw`text-xs text-center`}>
                  {t('profile.books')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={tw`mr-5`}>
                <Text style={tw`text-base font-bold mx-4`}>
                  {!!user && user?.fallowers
                    ? Object.keys(user.fallowers ?? {}).length
                    : '0'}
                </Text>
                <Text style={tw`text-xs text-center`}>
                  {t('profile.followers')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={tw`mr-5`}>
                <Text style={tw`text-base font-bold mx-4`}>
                  {!!user && user?.fallowing
                    ? Object.keys(user.fallowing ?? {}).length
                    : '0'}
                </Text>
                <Text style={tw`text-xs text-center`}>
                  {t('profile.following')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={tw`text-sm font-semibold mt-2 mb-5`}>
            {!!user ? user.name + ' ' + user.lastName : 'User Name'}
          </Text>

          {isAuthUser ? (
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('EditProfile', {user: user})
              }
              style={tw`bg-[${Colors.lightPurple}] rounded-md p-2 mb-10`}>
              <Text style={tw`text-white text-center font-bold text-sm`}>
                {t('profile.edit-profile')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleFollow}
              style={tw`bg-[${Colors.lightPurple}] rounded-md p-2 mb-10`}>
              <Text style={tw`text-white text-center font-bold text-sm`}>
                {authUser?.fallowing?.includes?.(userId)
                  ? 'Unfollow'
                  : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}

          <FlatList
            data={posts}
            renderItem={({item}) => (
              <TouchableOpacity
                style={tw`flex-row border border-gray-200`}
                onPress={() =>
                  props.navigation.navigate(RouteNames.singlePost, {
                    id: item?.id,
                  })
                }>
                <Image
                  resizeMode="cover"
                  style={tw`w-30 h-30`}
                  source={{
                    uri: item?.postImg,
                  }}
                />
              </TouchableOpacity>
            )}
            numColumns={3}
            keyExtractor={item => item.id}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
