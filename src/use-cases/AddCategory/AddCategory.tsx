import {
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  INavigationType,
  IWithNavigation,
} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import {categories} from '../../infrastructure/Utils/useBook';
import {AddCategoryItem} from '../../components/DiscoverBook/AddCategoryItem';
import tw from 'twrnc';
import {Colors} from '../../resources/constants/Colors';
import axios from 'axios';
import database from '@react-native-firebase/database';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import {ActivityIndicator} from 'react-native';
type IAddCategory = IWithNavigation<RouteNames.addCategory>;
export const getCategoryPhotos = async (
  categories: string[],
): Promise<
  | {
      images: {
        id: number;
        category: string;
        url: any;
      };
    }[]
  | undefined
> => {
  try {
    let images = [];
    let i = 0;
    for (; i < categories.length; i++) {
      const data = await axios.get(
        `https://pixabay.com/api/?key=23266537-d3b0b63adb5af1ba19302b426&q=
  ${categories?.[i]}&image_type=photo`,
      );

      images.push({
        id: i,
        category: categories[i],
        url: data.data.hits['0'].previewURL,
      });
    }
    return images;
  } catch (err) {
    Alert.alert('Something went wrong...2');
  }
};
export const AddCategory: React.FunctionComponent<IAddCategory> = props => {
  const user = useAppSelector(store => store.user.user);
  const [isLoading, setIsLoading] = React.useState(false);
  const [photos, setPhotos] = React.useState([]);
  const [userCategories, setUserCategories] = React.useState<string[]>([]);
  React.useEffect(() => {
    getCategoryPhotos(categories).then(data => {
      setPhotos(data);
    });
    database()
      .ref(`users/${user?.id}/categories`)
      .once('value', snapshot => {
        const data = snapshot.val();
        setUserCategories(data);
      });
  }, [user?.id]);
  const handleTopicList = () => {
    setIsLoading(true);
    database()
      .ref(`users/${user?.id}`)
      .update({categories: userCategories})
      .then(() => {
        setIsLoading(false);
        props.navigation.navigate(RouteNames.discoverBook);
      })
      .catch(() => {
        Alert.alert('Something went wrong...');
      });
  };

  console.warn('data', userCategories);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={{backgroundColor: Colors.lightPurple, padding: 10}}>
        <Text
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18,
            margin: 10,
            marginBottom: 0,
          }}>
          Welcome
        </Text>
        <Text
          style={{
            color: 'white',
            marginLeft: 10,
            marginBottom: 5,
            fontSize: 18,
          }}>
          Choose the topics
        </Text>
      </View>
      <FlatList
        data={photos}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <AddCategoryItem
            item={item}
            index={index}
            isUserCategory={userCategories?.includes?.(item?.category)}
            selectedCategories={userCategories}
            setSelectedCategories={setUserCategories}
          />
        )}
        numColumns={3}
      />

      <View style={tw`bg-white`}>
        <TouchableOpacity
          onPress={handleTopicList}
          style={tw`bg-[${Colors.lightPurple}] items-center p-4 m-4 mb-2  rounded-lg`}>
          {isLoading ? (
            <ActivityIndicator size={'small'} color={'white'} />
          ) : (
            <Text style={tw`text-sm  font-semibold text-white`}>Apply</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
