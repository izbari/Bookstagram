import React, {useState} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Dimensions,
  
} from 'react-native';
import {useSelector} from 'react-redux';
import {TouchableRipple, Searchbar, Divider} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {useSearch} from '../utils/searchUtils';
import Error from '../components/Error';
import BookCard from '../components/BookCard';
import Icon from '../components/Icons';
import FastImage from 'react-native-fast-image';
const {width} = Dimensions.get('window');
function Library(props) {
  const list = useSelector(store => store.favList);

  const [cardData, setCardData] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);
  const [loading3, setLoading3] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [sortId, setSortId] = useState(1);
  const [value, setValue] = React.useState(null);
  //const [splash, setSplash] = React.useState(true);
  const [error, setError] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(false);
  //bottom sheet variables
  const bs = React.useRef(null);
  const fall = new Animated.Value(1);
  if (error) {
    return <Error style={styles.lottieContainerError} />;
  }

  const handleLoadMore = async param => {
    if (!loading3) {
      setCurrentPage(currentPage + 40);
      console.log('currentPage1=' + currentPage);

      const res = await getLoadMoreData(search, currentPage);
    }
  };

  const getLoadMoreData = async (text, currentPage) => {
    setLoading3(true);

    console.log('currentPage2=' + currentPage);
    // same input with pagination
    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${text}&maxResults=40&orderBy=relevance&startIndex=${
      currentPage + 40
    }&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0`;
    const res = await useSearch(API_URL);
    setCardData(cardData.concat(res));
    setLoading3(false);
  };

  const getData = async text => {
    //new searching
    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${text}&maxResults=40&orderBy=relevance&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0`;

    setLoading2(true);
    const res = await useSearch(API_URL);
    const bookData = res;
    setLoading2(false);
    setCardData(bookData);
    setLoading(false);
  };
  const onChangeHandler = async e => {
    setCurrentPage(0);
    getData(e);
    setSearch(e);
  };

  const renderFooter = () => {
    return loading3 ? (
      <View style={{alignItems: 'center', margin: 10}}>
        <ActivityIndicator size="small"></ActivityIndicator>
      </View>
    ) : null;
  };
  const refreshHandler = () => {
    setLoading(true);
    getData(search);
  };
  const BottomSheetDragger = () => {
    return (
      <View
        style={{
          height: 75,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: 'white',
          justifyContent: 'center',
        }}>
        <Icon
          name="Drag"
          size={35}
          fill="#909090"
          style={{alignSelf: 'center'}}
        />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginHorizontal: 20,
          }}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 24, color: '#4d4d4d', fontWeight: '450'}}>
              Sırala
            </Text>
          </View>
          <TouchableRipple
            onPress={() => {
              setModalVisible(false);
            }}
            mode="text"
            compact
            rippleColor="transparent"
            uppercase={false}>
            <Text style={{color: sortId == 1?'#4d4d4d' : "#ff6ea1", fontWeight: 'bold', fontSize: 15}}>
              {sortId == 1 ? 'Kapat' : 'Uygula'}
            </Text>
          </TouchableRipple>
        </View>
      </View>
    );
  };
  const SortItem = ({id,text}) => {
    return (
        <TouchableRipple
        mode="text"
        compact
        rippleColor="transparent"
        uppercase={false}
          onPress={() => {
            setSortId(id);
          }}>
         <View style={{flexDirection: 'row', margin: 20,}}>
         <View
            style={{
              
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              width: 25,
              height: 25,
              backgroundColor: sortId == id ? '#FF6EA1' : 'white',
              borderColor: 'grey',
              borderWidth: sortId == id ? 0 : 1,
              borderRadius: 100,
              marginRight: 10,
            }}>
            <Icon name="CheckMark" size={22} fill={"white"} />
          </View> 
          <View>
            <Text style={{fontSize: 16, color: '#4d4d4d',alignSelf:'center'}}>
          {text}
        </Text>
        </View>
         </View>
        </TouchableRipple>
    );
  };

  const BottomsheetCommentContent = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: '100%',
          justifyContent: 'center',
        }}>
        <View style={{flex: 1}}>
          <SortItem id={1} text={"Akıllı Sıralama"}/>
          <Divider />
          <SortItem id={2} text={"En Çok Satanlar"}/>
          <Divider />
          <SortItem id={3} text={"Değerlendirme Sayısı"}/>
          <Divider />
          <SortItem id={4} text={"Beğeni Sayısı"}/>
          <Divider />
          <SortItem id={5} text={"Artan Fiyat"}/>
          <Divider />
          <SortItem id={6} text={"Azalan Fiyat"}/>
          <Divider />

        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Searchbar
        style={{borderColor: 'grey', margin: 10}}
        inputStyle={{fontSize: 15}}
        placeholder="Search a Book ..."
        lightTheme
        onChangeText={text => onChangeHandler(text)}
        autoCorrect={false}
        value={search}
      />
      {cardData ? (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#e5e5e5',
            width: '90%',
            height: 50,
            alignSelf: 'center',
            justifyContent: 'space-between',
            borderRadius: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="Sort" size={22} fill={'black'} />
            <Text style={{marginLeft: 10, fontSize: 15}}>Sırala</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="Filter" size={22} fill={'black'} />
            <Text style={{marginLeft: 10, fontSize: 15}}>Filtrele</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {loading2 ? (
        <View style={{alignItems: 'center', margin: 10}}>
          <ActivityIndicator size="small"></ActivityIndicator>
        </View>
      ) : null}
      {!cardData ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            padding: 40,
          }}>
          <FastImage
            style={{height: 400, width: 400}}
            source={require('../assets/png/SearchError.jpg')}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      ) : (
        <FlatList
          data={cardData}
          renderItem={({item}) => (
            <BookCard
              currentScreen="Library"
              navigate={props.navigation.navigate}
              item={item}
              list={list}
            />
          )}
          keyExtractor={item => item?.id}
          onEndReached={handleLoadMore}
          ListFooterComponent={renderFooter}
          onRefresh={refreshHandler}
          refreshing={loading}
        />
      )}
      {modalVisible && (
        <BottomSheet
          onCloseEnd={() => {
            setModalVisible(false);
          }}
          enabledBottomInitialAnimation={true}
          ref={bs}
          snapPoints={['65%', 0]}
          initialSnap={0}
          callbackNode={fall}
          renderContent={BottomsheetCommentContent}
          renderHeader={BottomSheetDragger}
          enabledGestureInteraction={true}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#f0f0f0'},
  lottieContainer: {
    width: '10%',
    height: '5%',
    alignSelf: 'center',
  },
  lottieContainerError: {
    width: '50%',
    height: '50%',
    alignSelf: 'center',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonContainer: {flex: 1, margin: 10},
  button: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    width: 290,
    height: 38,
    backgroundColor: '#FF6EA1',
    justifyContent: 'center',
    alignSelf: 'center',
    margin: 10,
  },
  buttonText: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    paddingLeft: 12,
    borderRadius: 10,

    width: 290,
    height: 50,
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 10,
    backgroundColor: 'white',
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default Library;
