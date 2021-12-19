import React from 'react';
import {View, Text, Dimensions,FlatList,TouchableOpacity} from 'react-native';
import {SearchBar} from 'react-native-elements';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import parseFirebaseData from '../utils/parseFirebaseData'
import Image  from 'react-native-image-progress';

const {width} = Dimensions.get('window');
const NewMessage = (props) => {
  const [search, setSearch] = React.useState('');
  const [users, setUsers] = React.useState([]);
  const [searchedUsers, setSearchedUsers] = React.useState([]);

  

React.useEffect(() =>{
    getData()

 },[])
 
 const getData = async () => {
    await database()
    .ref('/users/')
    .once('value')
    .then(snapshot => {
      let data =parseFirebaseData(snapshot.val(),auth().currentUser.uid)
       data= data.filter(user => {return user.id != auth().currentUser.uid})
      setUsers(data)
      setSearchedUsers(data)
    });
 }
 

 const searchFilterFunction = text => {    
    const newData = searchedUsers.filter(item => {      
      const itemData = `${item.name.toUpperCase()}   
      ${item.lastName.toUpperCase()}`;
      
       const textData = text.toUpperCase();
        
       return itemData.indexOf(textData) > -1;    
    });
    
    setUsers(newData)  
  };

 const userItem = ({item}) => {

  return(
        <TouchableOpacity
        onPress={() =>props.navigation.navigate('ChatSingleScreen',{name:item.name +" "+item.lastName,uid:item.id})} 
        style={{
          flexDirection: 'row',
          width: width*.95,
         margin:10,
         marginBottom:3,
       alignSelf: 'center',
      
       backgroundColor: 'white',
       borderRadius: 10,
       shadowColor: '#CBCBCB',
       elevation: 25,
     }}>
       <Image
          style={{
           height: 50,
           width: 50,
           resizeMode: 'contain',
           borderRadius: 50,
           overflow: 'hidden',
           elavation: 15,
           margin:7,
         
         }}
       source={{uri : item.imageUrl}}/>
       <View style={{justifyContent: 'center',marginLeft: 10,padding: 5}}>
         <Text style={{fontWeight: 'bold'}}>{item.name+" "+item.lastName}</Text>
       </View>
     </TouchableOpacity>
     )
 }
 
 
  return (
    <View>
      <SearchBar
        containerStyle={{marginTop:15,alignSelf: 'center',height:45,margin:7,backgroundColor:'#DEDFE4',width:width*0.9,borderRadius: 15}}
        inputContainerStyle={{height:10,backgroundColor:'#DEDFE4'}}
        inputStyle={{fontSize:15}}
        placeholder="Type Something ..."
        lightTheme
        onChangeText=
        {(text)=>{setSearch(text)
            searchFilterFunction(text)}}
        autoCorrect={false}
        value={search}
      />    

      <FlatList 
      data={ users}
      renderItem={userItem}
      keyExtractor={item=>item.id}
      />
    </View>
  );
};

export default NewMessage;
