import { Avatar, Badge, Icon, withBadge } from 'react-native-elements';
import React, { Component } from 'react';
import { StyleSheet, FlatList, SafeAreaView, View, Text, TouchableOpacity } from 'react-native';


const initialData = [{ id: 1 },
{ id: 2 },
{ id: 3 },
{ id: 4 },
{ id: 5 },
{ id: 6 },
{ id: 7 },
{ id: 8 },
{ id: 9 },
{ id: 10 },
{ id: 11 },
{ id: 12 },
{ id: 13 },
{ id: 14 },
{ id: 15 },
{ id: 16 },
{ id: 17 },
{ id: 18 },
{ id: 19 },
{ id: 20 },
{ id: 21 },
{ id: 22 },
{ id: 23 },
{ id: 24 },
{ id: 25 },
{ id: 26 },
{ id: 27 },
{ id: 28 },
{ id: 29 },
{ id: 30 },
{ id: 31 },
{ id: 32 },
{ id: 33 },
{ id: 34 },]; //all 300. Usually you receive this from server or is stored as one batch somewhere
const ITEMS_PER_PAGE = 10; // what is the batch size you want to load.
export default class Discover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: initialData.slice(0, 10), // you can do something like initialData.slice(0, 10) to populate from initialData.
      dataSource: [],
      page: 1,
    };
  }


  loadMore() {
    const page = this.state.page;
    console.log("page",page)
    const data = this.state.data;
    console.log("data",data)

    const start = page * ITEMS_PER_PAGE;
    const end = (page + 1) * ITEMS_PER_PAGE - 1;

    const newData = initialData.slice(start, end); // here, we will receive next batch of the items
    return this.setState({ data: [...data, ...newData] ,page: page + 1}); // here we are appending new batch to existing batch
  }
   bookAvatar = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        console.log(item.id);
      }}>
      <View style={{height: 100, width: 100, margin: 17.5, marginBottom: 20}}>
        <Avatar
          style={{height: 85, width: 85}}
          source={{
            uri: 'https://randomuser.me/api/portraits/men/' + item.id + '.jpg',
          }}
          size="large"
          rounded
        />

        <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>
          Category {item.id}
        </Text>
      </View>
    </TouchableOpacity>
  );

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={{ backgroundColor: '#FF6EA1', padding: 10 }}>
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
          data={this.state.data}
          keyExtractor={item => item.id}
          renderItem={this.bookAvatar}
          onEndReached={this.loadMore}
          numColumns='3'
          extraData={this.state.data}
        />
        <TouchableOpacity>
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
          style={{
            width: '80%',
            height: '6%',
            borderRadius: 5,
            backgroundColor: '#FF6EA1',
            alignSelf: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}>
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            Apply
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

    )
  }
}
  const styles = StyleSheet.create({
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

