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
import {TouchableRipple, Searchbar, List, Divider} from 'react-native-paper';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {useSearch} from '../utils/searchUtils';
import Error from '../components/Error';
import BookCard from '../components/BookCard';
import Icon from '../components/Icons';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
const {width} = Dimensions.get('window');
function Library(props) {
  const list = useSelector(store => store.favList);

  const [cardData, setCardData] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);
  const [loading3, setLoading3] = React.useState(false);
  const [sortVisible, setSortVisible] = React.useState(false);
  const [filterVisible, setFilterVisible] = React.useState(false);
  //const [filterValue, setFilterValue] = useState([]);
  const [sortId, setSortId] = useState(1);
  const [value, setValue] = React.useState(null);
  //const [splash, setSplash] = React.useState(true);
  const [error, setError] = React.useState(false);
  let filterInfo = [];
  const [currentPage, setCurrentPage] = React.useState(false);
  //bottom sheet variables
  const bs = React.useRef(null);
  const fall = new Animated.Value(1);

  //sort Data
  const sortData = [
    {id: 1, text: 'Akıllı Sıralama'},
    {id: 2, text: 'En Çok Satanlar'},
    {id: 3, text: 'Değerlendirme Sayısı'},
    {id: 4, text: 'Beğeni Sayısı'},
    {id: 5, text: 'Artan Fiyat'},
    {id: 6, text: 'Azalan Fiyat'},
  ];
  let filterData = [
    {
      Kategoriler: {
        id: 1,
        data: [
          {filter: 'E-Kitap', isChecked: false},
          {filter: 'Kişisel', isChecked: false},
          {filter: 'Roman', isChecked: false},
          {filter: 'Dergi', isChecked: false},
          {filter: 'Kültür', isChecked: false},
          {filter: 'Eğitim', isChecked: false},
          {filter: 'Bilim', isChecked: false},
          {filter: 'Tarih', isChecked: false},
        ],
      },
      Yazarlar: {
        id: 2,
        data: [
          {filter: 'Zafer Barış', isChecked: false},
          {filter: 'Oliver Twist', isChecked: false},
          {filter: 'Haydar Dümenci', isChecked: false},
          {filter: 'Nazım Hikmet', isChecked: false},
          {filter: 'Teyfik Fikret', isChecked: false},
        ],
      },
      Yayınevleri: {
        id: 3,
        data: [
          {filter: 'Yayınevi 1', isChecked: false},
          {filter: 'Yayınevi 2', isChecked: false},
          {filter: 'Yayınevi 3', isChecked: false},
          {filter: 'Yayınevi 4', isChecked: false},
          {filter: 'Yayınevi 5', isChecked: false},
          {filter: 'Yayınevi 6', isChecked: false},
        ],
      },
      Diller: {
        id: 4,

        data: [
          {filter: 'İngilizce', isChecked: false},
          {filter: 'Fransızca', isChecked: false},
          {filter: 'Türkçe', isChecked: false},
          {filter: 'Almanca', isChecked: false},
          {filter: 'İtalyanca', isChecked: false},
        ],
      },
      'Fiyat Aralığı': {
        id: 5,
        data: [
          {filter: '0 - 10', isChecked: false},
          {filter: '10 - 50', isChecked: false},
          {filter: '50 - 100', isChecked: false},
          {filter: '100 - 200', isChecked: false},
          {filter: '200 - 500', isChecked: false},
          {filter: '500 - 1000', isChecked: false},
          {filter: '1000 - 2000', isChecked: false},
        ],
      },
    },
  ];
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
            <Text style={{fontSize: 24, color: '#4d4d4d', fontWeight: '400'}}>
              {sortVisible ? 'Sırala' : 'Filtrele'}
            </Text>
          </View>
          <TouchableRipple
            onPress={() => {
              if (sortVisible) {
                setValue(sortData.find(item => item.id === sortId).text);
                setSortVisible(false);
              } else if (filterVisible) {
                let options=[]
                console.log('Filtre ayarı : ', ...filterData);
                setFilterVisible(false);
                Object.keys(filterData[0]).map(item => {
                  console.log("categoryi ismi olması lazım", item);
                  filterData[0][item]['data'].map((item2)=>{
                    item2.isChecked ? options.push(item+"_"+item2.filter) : null;
                    console.log("qweqweqweqweqw",item2.isChecked);
                  })
                  
                  
                  })
                  console.warn(...options);
              }
              
            }}
            mode="text"
            compact
            rippleColor="transparent"
            uppercase={false}>
            <Text
              style={{
                color: sortId == 1 ? '#4d4d4d' : '#ff6ea1',
                fontWeight: 'bold',
                fontSize: 15,
              }}>
              {sortVisible ? (sortId == 1 ? 'Kapat' : 'Uygula') : 'Uygula'}
            </Text>
          </TouchableRipple>
        </View>
      </View>
    );
  };
  const SortItem = ({item}) => {
    if (sortId != item.id) {
      return (
        <TouchableRipple
          style={{borderBottomColor: '#e5e5e5', borderBottomWidth: 1}}
          mode="text"
          compact
          rippleColor="transparent"
          uppercase={false}
          onPress={() => {
            setSortId(item.id);
          }}>
          <View style={{flexDirection: 'row', margin: 20}}>
            <View style={styles.sortItem}></View>
            <View>
              <Text
                style={{fontSize: 16, color: '#4d4d4d', alignSelf: 'center'}}>
                {item.text}
              </Text>
            </View>
          </View>
        </TouchableRipple>
      );
    } else if (item.id == sortId) {
      return (
        <TouchableRipple
          style={{borderBottomColor: '#e5e5e5', borderBottomWidth: 1}}
          mode="text"
          compact
          rippleColor="transparent"
          uppercase={false}
          onPress={() => {
            setSortId(item.id);
          }}>
          <View style={{flexDirection: 'row', margin: 20}}>
            <View
              style={[
                styles.sortItem,
                {
                  backgroundColor: '#FF6EA1',
                  borderWidth: 0,
                },
              ]}>
              <Icon name="CheckMark" size={22} fill={'white'} />
            </View>
            <View>
              <Text
                style={{fontSize: 16, color: '#4d4d4d', alignSelf: 'center'}}>
                {item.text}
              </Text>
            </View>
          </View>
        </TouchableRipple>
      );
    } else
      return (
        <View>
          <Text>NULL</Text>
        </View>
      );
  };

  const BottomsheetContent = ({children}) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: '100%',
          justifyContent: 'center',
        }}>
        <View style={{flex: 1}}>{children}</View>
      </View>
    );
  };

  const SingleInnerFilterItem = ({item, category,index}) => {
    const [isSelected, setIsSelected] = useState(false);
    console.log('rerender2',filterData[0][category]["data"][index]["isChecked"] );
    console.log("sonuncu",category);
    return (
      <TouchableRipple
        key={item.filter}
        onPress={() => {
          if (isSelected) {
            console.log(item, 'kaldırıldı');
            filterData[0][category]["data"][index]["isChecked"] = false;
            
          } else {
            console.log(item, 'eklendi');
            filterData[0][category]["data"][index]["isChecked"] = true;
            console.log(item, 'eklendi');

            console.log(filterData);  
          }
          setIsSelected(val => !val);
        }}
        rippleColor="transparent"
        style={{
          justifyContent: 'center',
          height: 40,
          margin: 10,
          padding: 5,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
          <View style={{flex: 1}}>
            <Text>{'• ' + item.filter}</Text>
          </View>
          <Icon
            name="CheckMark"
            size={22}
            fill={isSelected ? 'black' : 'white'}
            style={{marginRight: 10}}
          />
        </View>
      </TouchableRipple>
    );
  };

  const FilterSingleItem = ({item,category}) => {
    console.log(category, 'category');
    console.log("single data",item['data']);
    return (
      <View
        style={{
          flex: 1,

          marginTop: 20,
        }}>
        <View
          style={{
            flex: 1,
            marginLeft: 20,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Icon name="ExpandMore" size={25} fill={'grey'} />
            <Text style={{fontSize: 18, color: '#4d4d4d'}}>{category}</Text>
          </View>
          {item['data'].map((item,index) => 
           <SingleInnerFilterItem  key={index} item={item} category={category} index={index}/>
            )}
          
          
          <View style={{flex: 1, marginTop: 10}}></View>

        </View>
      </View>
    );
  };

  const FilterComponent = () => {
    console.log("keys : ", Object.keys(filterData))

    {Object.keys(filterData[0]).map((key) => (
      console.log("key : ", key)
    ))}
    return(
    <ScrollView>
      {Object.keys(filterData[0]).map((key) => (
        <FilterSingleItem key={filterData[key]} item={filterData[0][key]} category={key} />
      ))}
    </ScrollView>
  );}
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
              setSortVisible(true);
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
            onPress={() => {
              setFilterVisible(true);
            }}
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
      {(sortVisible || filterVisible) && (
        <BottomSheet
          onCloseEnd={() => {
            setSortVisible(false);
            setFilterVisible(false);
          }}
          enabledBottomInitialAnimation={true}
          ref={bs}
          snapPoints={sortVisible ? ['65%', 0] : ['85%', 0]}
          initialSnap={0}
          callbackNode={fall}
          renderContent={() => (
            <>
              {sortVisible ? (
                <BottomsheetContent
                  children={sortData.map(item => (
                    <SortItem key={item.id} item={item} />
                  ))}
                />
              ) : (
                <BottomsheetContent children={<FilterComponent />} />
              )}
            </>
          )}
          renderHeader={BottomSheetDragger}
          enabledGestureInteraction={true}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#f0f0f0'},
  sortItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: 25,
    height: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 100,
    marginRight: 10,
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
