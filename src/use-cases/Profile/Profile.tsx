import {View, Text, TouchableOpacity, Image, FlatList} from 'react-native';
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
type IProfileMainProps = IWithNavigation<RouteNames.profileMain>;

//import i18n from 'i18next'
export const Profile: React.FunctionComponent<IProfileMainProps> = props => {
  const {t} = useTranslation();
  const user = useAppSelector(store => store.user.user);
  console.warn('user', user?.id);
  const [posts, setPosts] = useState<IPost>([]);

  const getPostsByUserId = async () => {
    const posts: IPost[] = [];
    const postRef = firestore().collection('posts');
    const response = await postRef.where('userId', '==', user?.id).get();
    console.warn('response', response);
    response?.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
      posts.push({...(doc.data() as IPost), id: doc.id});
    });
    setPosts(posts);
  };

  useEffect(() => {
    getPostsByUserId(user?.id);
  }, []);

  return (
    <View style={{margin: 10, padding: 10}}>
      <View style={tw`flex-row items-center `}>
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
              {!!user ? user.books?.length : '1000'}
            </Text>
            <Text style={tw`text-xs text-center`}>{t('profile.books')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`mr-5`}>
            <Text style={tw`text-base font-bold mx-4`}>
              {!!user && user?.fallowers
                ? Object.keys(user.fallowers ?? {}).length
                : '1000'}
            </Text>
            <Text style={tw`text-xs text-center`}>
              {t('profile.followers')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`mr-5`}>
            <Text style={tw`text-base font-bold mx-4`}>
              {!!user && user?.fallowing
                ? Object.keys(user.fallowing ?? {}).length
                : '1001'}
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

      <TouchableOpacity
        onPress={() => props.navigation.navigate('EditProfile', {user: user})}
        style={tw`bg-[${Colors.lightPurple}] rounded-md p-2 mb-10`}>
        <Text style={tw`text-white text-center font-bold text-sm`}>
          {t('profile.edit-profile')}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={posts}
        renderItem={({item}) => (
          <TouchableOpacity style={tw`flex-row border border-gray-200`}>
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
  );
};
