import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Button,
  Dimensions,
  Flatlist,
} from 'react-native';
import PostCard from '../components/Post';
import Image from 'react-native-image-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

function App(props) {
  const [mail, setMail] = React.useState('');

  return (
    <SafeAreaView style={styles.mainContainer}>
      <PostCard />
      
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {flex: 1},

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
    backgroundColor: 'red',
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

export default App;
