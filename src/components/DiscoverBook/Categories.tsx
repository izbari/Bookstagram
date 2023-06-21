import {FlatList} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import CategoryItem from './CategoryItem';
import database from '@react-native-firebase/database';
import {AddCategoryButton} from './AddCategoryButton';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import {getCategoryPhotos} from '../../use-cases/AddCategory/AddCategory';
type ICategories = {};
const Categories: React.FunctionComponent<ICategories> = props => {
  const user = useAppSelector(store => store.user.user);
  const [userCategories, setUserCategories] = React.useState([]);
  React.useEffect(() => {
    database()
      .ref(`users/${user?.id}/categories`)
      .on('value', snapshot => {
        const data = snapshot.val();
        getCategoryPhotos(data).then(_data => {
          setUserCategories(_data);
        });
      });
  }, [user?.id]);
  return (
    <FlatList
      style={tw`p-2 my-3 mx-1 mr-2`}
      data={userCategories}
      ListHeaderComponent={AddCategoryButton}
      renderItem={({item}) => (
        <CategoryItem category={item.category} url={item.url} />
      )}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Categories;
