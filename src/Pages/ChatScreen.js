import React, { useState, useCallback, useEffect } from 'react'
import { View,SafeAreaView,Text,TouchableOpacity,Dimensions,FlatList,RefreshControl } from 'react-native'
import Image  from 'react-native-image-progress';
import auth from '@react-native-firebase/auth';
const {width} = Dimensions.get('window')
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

export default function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  let selectedPath=[]  
const chats =[]




const getAllData = async() => {
  const postIds = await firestore().collection('Chats').get();
    
    
    postIds.forEach(message => {
            
            if( message.data().chatId.split('-')[0] == auth().currentUser.uid) {
              selectedPath.push(message.data().chatId)
            } else if( message.data().chatId.split('-')[1] == auth().currentUser.uid) {
             selectedPath.push(message.data().chatId)
            }
    })  
    
   

    selectedPath.forEach(async(postId) => {
      console.log(postId)
      const querySanp = await firestore()
      .collection("Chats")
      .doc(postId)
      .collection("messages")
      .orderBy("createdAt","desc")
      .limit(1)
      .get()
      
       querySanp.docs.map( (docSanp) =>  {
  
             const chat={
              ...docSanp.data(),
              createdAt: docSanp.data().createdAt.toDate(),
              senderUserData: docSanp.data().senderUserData,
            }
            chats.push(chat) 
            
      })
      


     setMessages( {...messages,chats})
      console.log("messages",messages)
    })
}


  useEffect( async() => { 
    await getAllData()

    setRefreshing(false)
    
},[refreshing])

  const toChat = (item) => {
    props.navigation.navigate('ChatSingleScreen',
    {name:item.recieverUserData.name +" "+item.recieverUserData.lastName,uid:item.recieverUserData.id})

  }
  const getPosts = async () => {

      const postIds = await firestore().collection('Chats').get();
    
    
    postIds.forEach(message => {
            
            if( message.data().chatId.split('-')[0] == auth().currentUser.uid) {
              selectedPath.push(message.data().chatId)
            } else if( message.data().chatId.split('-')[1] == auth().currentUser.uid) {
             selectedPath.push(message.data().chatId)
            }
    })  



    try {
      const list = [];
      await firestore()
        .collection('Chats')
        .doc(chatId)
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
             list.push({
              ...doc.data(),
              createdAt: doc.data().createdAt.toDate(),
              senderUserData: doc.data().senderUserData,
            })
            console.log("get posttan gelen data:",{
              ...doc.data(),
              createdAt: doc.data().createdAt.toDate(),
              senderUserData: doc.data().senderUserData,
            })
          });
         
        });
    } catch (error) {
      console.log(error.msg);
    }
  };
    
  
  const ChatObject = ({item,index}) => {
    return(
      <TouchableOpacity
      onPress={()=>toChat(item)}  
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
        source={{uri : item.recieverUserData.imageUrl}}/>
        <View style={{justifyContent: 'center',marginLeft: 10,padding: 5}}>
         
         <Text style={{fontWeight: 'bold'}}>{messages.length !=0 ? item?.recieverUserData.name+" " + item?.recieverUserData.lastName : "daha gelmedi"}</Text>
          <View  style={{flexDirection: 'row',width:width-(width*0.05+90)}}>
          <Text 
          numberOfLines={1} 
          style={{fontStyle: 'italic',fontSize:12,color: 'grey',marginTop:5}}>{messages.length !=0 ? item.text : "daha gelmedi"}</Text>
         </View>
         <View style={{alignItems: 'flex-end'}}>
          <Text style={{color: 'darkgrey', fontSize: 12}}>{messages.length !=0 ? moment(item?.createdAt).fromNow() : "daha gelmedi"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  

  return (
    <SafeAreaView style={{flex:1}}>
     <FlatList 
     data={messages?.chats?.sort(function (a, b) {
      var dateA = new Date(a.createdAt).getTime();
      var dateB = new Date(b.createdAt).getTime();
      return dateA < dateB ? 1 : -1; // ? -1 : 1 for ascending/increasing order
    })}
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={()=>getAllData()}
      />
    }
     renderItem={ChatObject}
     keyExtractor={item=>item._id}
     ListEmptyComponent={ <View style={{flex:1,alignItems: 'center',margin:15,marginTop:100}}>
       
       <Text style={{fontStyle: 'italic',fontSize: 16}}>You have no messages.</Text>
        <Text style={{fontStyle: 'italic',fontSize: 14}}>To create click top right icon</Text>
      
     </View>}
     />

      </SafeAreaView>
  )
}