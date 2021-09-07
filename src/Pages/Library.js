import * as React from 'react';
import { Rating } from "react-native-rating-element"; import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Button,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { SearchBar } from 'react-native-elements';
import { TextInput } from 'react-native-paper';
import Login from '../components/Welcome';

function Library(props) {
  const [cardData, setCardData] = React.useState([]);
  const [search, setSearch] = React.useState('');
  React.useEffect(() => {
    getData();
  }, [])



  const getData = async () => {
    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${search}&maxResults=40&langRestrict=en&orderBy=relevance&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0`
    await axios.
      get(API_URL).
      then((res) => {
        setCardData(res.data.items)
      }).
      catch((err) => { console.log(err) })
  }


  const checkThumbnail = (index) => {
    if (typeof (cardData[index].volumeInfo.imageLinks.thumbnail)) {
      return cardData[index].volumeInfo.imageLinks.thumbnail
    }

    else {
      return "https://cdn.pixabay.com/photo/2017/06/08/17/32/not-found-2384304_150.jpg"
    }
  }
  const checkDescription = (index) => {
    if (typeof (cardData[index].volumeInfo.description)) {
      return cardData[index].volumeInfo.description.slice(0, 80)
    }

    else {
      return "Description is not found!"
    }
  }
  const checkAuthor = (index) => {
    if (typeof (cardData[index].volumeInfo.author)) {
      return cardData[index].volumeInfo.author.slice(0, 20)
    }

    else {
      return "Author is not found!"
    }
  }
  const checkTitle = (index) => {
    if (typeof (cardData[index].volumeInfo.title)) {
      return cardData[index].volumeInfo.title.slice(0, 15)
    }

    else {
      return "Title is not found!"
    }
  }
  const BookCard = ({ item, index }) => {
    return (
      <View style={{ flex: 0.5, flexDirection: 'row', height: '70%', width: '95%', padding: 10, justifyContent: 'flex-start', marginLeft: 10, marginTop: 10 }}>
        <View style={{ backgroundColor: 'white', flex: 0.8, }}>
          <Image
            source={{ uri: checkThumbnail() }}
            style={{ height: 175, width: 120, resizeMode: 'cover', alignSelf: 'flex-start', borderRadius: 5 }}
          />
        </View>
        <View style={{ backgroundColor: 'white', flex: 1.4, padding: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
          <Text style={{ marginBottom: 7, color: "#575758", fontWeight: 'bold' }}>{checkTitle()}</Text>
          <Text style={{ marginBottom: 10, color: "#A0A0A1" }}>{checkAuthor()}</Text>

          <Rating
            rated={5}
            totalCount={2.5}
            ratingColor="#FF6DA0"
            ratingBackgroundColor="#d4d4d4"
            size={15}
            readonly // by default is false
            icon="ios-star"
            direction="row" // anyOf["row" (default), "row-reverse", "column", "column-reverse"]
          />
          <Text style={{ marginBottom: 5, marginTop: 5, fontSize: 10 }}>{checkDescription(index)}...</Text>
          <View
            style={{
              flexDirection: 'row', flex: 1,
              justifyContent: 'center', alignContent: 'space-around'
            }}>

            <TouchableOpacity
              style={{
                marginTop: 17, backgroundColor: '#FF6EA1', elevation: 20,
                shadowColor: '#52006A', flex: 1, height: 35, borderRadius: 5, shadowColor: 'black', justifyContent: 'center', marginRight: 10
              }}
              onPress={null}
            >
              <View>
                <Text style={{ color: 'white', fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>Add to cart</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                elevation: 20,
                shadowColor: '#52006A', marginTop: 17, backgroundColor: 'white', flex: 1, height: 35, justifyContent: 'center', borderRadius: 5
              }}
              onPress={null}
            >
              <View>
                <Text style={{ color: 'black', fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>Add to wishlist</Text>
              </View>
            </TouchableOpacity>


          </View>

        </View>
      </View>
    )
  }

  return (
    <SafeAreaView>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={(req) => {setSearch(req)
        getData()}}
        value={search}
        lightTheme='true'
      />
      <FlatList
        data={cardData}
        renderItem={BookCard}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FF6EA1' },
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
  buttonContainer: { flex: 1, margin: 10 },
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
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }

});

export default Library;
