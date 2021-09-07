import {Avatar, Badge, Icon, withBadge} from 'react-native-elements';
import React from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {ToastAndroid} from 'react-native';
import axios from 'axios';

function Discover(props) {
  const categories = [
    'Fantasy',
    'Adventure',
    'Diary',
    'Crime',
    'Mystery',
    'Horror',
    'Thriller',
    'Paranormal',
    'Historical fiction',
    'Science Fiction',
    'Memoir',
    'Cooking',
    'Art',
    'Poetry',
    'Development',
    'Motivational',
    'Health',
    'History',
    'Travel',
    'Drama',
    'Families & Relationships',
    'Humor',
    'Children',
    'Business',
  ];
  // States hooks
  const [bookData, setBookData] = React.useState([]);
  const [current, setCurrent] = React.useState(9);

  const images = [];

  React.useEffect(() => {
    getData();
  }, []);

  const loadMore = () => {
    console.log('Loading')
    if (current > bookData.length) {
      ToastAndroid.showWithGravityAndOffset(
        'All Topics are Showing',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    } else {
      setCurrent(current + 9);
    }
  };

  // "https://www.googleapis.com/books/v1/volumes?q=java&maxResults=40&langRestrict=en&orderBy=relevance&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0"
  const getData = async () => {
    // const API_URL = "https://www.googleapis.com/books/v1/volumes?q=java&maxResults=40&langRestrict=en&orderBy=relevance&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0"
    // await axios.
    //   get(API_URL).
    //   then((res) => {
    //     setBookData(res.data.items)
    //     console.log("getdatadayım:\n\n", bookData)
    //   }).
    //   catch((err) => { console.log(err) })

    for (let i = 0; i < categories.length; i++) {
      await axios
        .get(
          `https://pixabay.com/api/?key=23266537-d3b0b63adb5af1ba19302b426&q=
       ${categories[i]}&image_type=photo`,
        )
        .then(res => {
          images.push(res.data.hits['0'].previewURL);
        })
        .catch(err => {
          console.log(err);
        });
    }

    setBookData(images);
  };

  const bookAvatar = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        console.log(index);
      }}>
      <View style={{height: 110, width: 100, margin: 17.5, marginBottom: 20}}>
        <Avatar
          style={{height: 95, width: 95, resizeMode: 'contain'}}
          source={{
            uri: bookData[index],
          }}
          size="large"
          rounded
        />
        <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>
          {categories[index]}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={{backgroundColor: '#FF6EA1', padding: 10}}>
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
        data={bookData.slice(0, current)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={bookAvatar}
        numColumns="3"
      />
      <TouchableOpacity
        onPress={() => loadMore()}>
        <Text
          style={{
            alignSelf: 'center',
            marginBottom: 10,

            color: '#FF6EA1',
            textDecorationLine: 'underline',
          }}>
          More Topics
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate("Library")}
        style={{
          width: '80%',
          height: '6%',
          borderRadius: 5,
          backgroundColor: '#FF6EA1',
          alignSelf: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>
          Apply
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: 'white'},
  lottieContainer: {
    flex: 2,
    width: '85%',
    height: '30%',
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
});
export default Discover;
