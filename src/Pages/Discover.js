import { Avatar, Badge, Icon, withBadge } from 'react-native-elements';
import React from 'react';
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  View,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Svg, {
  Circle,

} from 'react-native-svg';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import { ToastAndroid } from 'react-native';
import axios from 'axios';

function Discover(props) {

  // States hooks

  const [cardData, setCardData] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);


  const { width, height } = Dimensions.get('window');

  React.useEffect(() => {
    getData();
  }, []);

  const getData = (text = "java") => {
    setLoading(true);

    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${text}&maxResults=20&orderBy=relevance&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0`;
    axios
      .get(API_URL)
      .then(res => {
        setTimeout(() => { setCardData(res.data.items) }, 1000);

        setLoading(false);

      })
      .catch(err => {
        console.log(err);
        setError(true);
        setLoading(false);

      });

  };

  return (
    <SafeAreaView style={{ flex: 1 }} >

      <View style={styles.pickedBooks}>



      </View>

      <View style={{ width: width, height: 120, backgroundColor: 'red', justifyContent: 'center' }}>
        <View style={{ justifyContent: 'center', backgroundColor: 'yellow',marginTop:25 }}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('AddTopics')}
            style={{
              marginLeft: 10, backgroundColor: '#44494B',
              width: 75, height: 75, borderRadius: 50,
              justifyContent: 'center'
            }}>
            <MaterialCommunityIcons
              name="plus"
              color="white"
              size={35}
              style={{ alignSelf: 'center' }} />

          </TouchableOpacity>
        </View>
        <FlatList
          data={null}
          renderItem={null}
          keyExtractor={(item => item.id)}

        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pickedBooks: { flex: 0.4, backgroundColor: '#EC9CBA' },
  mainContainer: { flex: 1, backgroundColor: 'white' },
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
});
export default Discover;
