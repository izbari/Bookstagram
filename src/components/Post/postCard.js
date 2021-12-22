import * as React from 'react';
import {Text, View, Dimensions, TouchableOpacity} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Image from 'react-native-image-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import  {Menu,Provider,Divider, Button,} from 'react-native-paper'    

const {width} = Dimensions.get('window');


function postCard(props) {
  
  const TEXT_SIZE =
    props.item.post != null
      ? Math.round(props.item.post.length / 40.0) * 20 + 10
      : 5;

  const [user, setUser] = React.useState({});
  const [visible, setVisible] = React.useState(false);
  const [menu, setMenu] = React.useState(false);

  const IMAGE_SIZE = props.item.postImg != null ? 250 : 5;
  React.useEffect(async () => {
    await database()
      .ref(`/users/${props.item.userId}`)
      .once('value')
      .then(snapshot => {
        setUser(snapshot.val());
      })
      
  }, []);
          
  
  const openMenu = () => setMenu(true);

  const closeMenu = () => setMenu(false);

  const Menü = (params) => (
    <Provider>
  <View
    style={{
    flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    }}>
    <Menu
      visible={menu}
      onDismiss={() => {setMenu(false)}}
      anchor={<Button title='zafer' onPress={() => {setMenu(!menu)}}>Show menu</Button>}>
      <Menu.Item onPress={() => {setMenu(false)}} title="Item 1" />
      <Menu.Item onPress={() => {}} title="Item 2" />
      <Divider />
      <Menu.Item onPress={() => {}} title="Item 3" />
    </Menu>
  </View>
</Provider>
  )
  
 
          
  
  
  const defaultImageUrl =
    'https://scontent.ftzx1-1.fna.fbcdn.net/v/t1.30497-1/c59.0.200.200a/p200x200/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=12b3be&_nc_ohc=CxmGyQqlfmQAX-g1lo4&_nc_ht=scontent.ftzx1-1.fna&edm=AHgPADgEAAAA&oh=4403c3ccd0fc5eed2b87a0f3cfbe5198&oe=616AB239';
    
 


  return (
    <View
      style={{
        margin: 15,
        alignSelf: 'center',
        width: width * 0.9,
        height: 50 + TEXT_SIZE + IMAGE_SIZE + 70 + (props.item.comments == 0 && props.item.likes == 0 ? 0 : 40),
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#CBCBCB',
        elevation: 25,
      }}>
                {menu && <Menü />}

      <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',}}>
      <TouchableOpacity
        onPress={() => props.toProfile(user.id)}
        style={{flexDirection: 'row', padding: 12, paddingBottom: 0}}>
        <Image
          style={{
            height: 50,
            width: 50,
            resizeMode: 'contain',
            borderRadius: 50,
            overflow: 'hidden',
            elavation: 5,
            marginTop: 5,
            marginLeft: 5,
          }}
          source={{
            uri: user ? user.imageUrl : defaultImageUrl,
          }}
        />
        <View style={{justifyContent: 'center', margin: 10, marginBottom: 0,marginTop:-8,marginLeft:12}}>
          <Text >{user.name + ' ' + user.lastName}</Text>
          <Text style={{color: 'grey', fontSize: 12}}>
            {moment(props.item.postTime.toDate()).fromNow()}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() =>{setVisible(!visible);}}>
          <Ionicons name = "ellipsis-horizontal" size={25} style={{margin: 5,marginRight: 20,}}color="grey"/>
        
          <Modal
  deviceWidth={width}
  swipeThreshold={10}
  onBackButtonPress={()=>setVisible(false)}
  useNativeDriver={true}
              propagateSwipe={true}
    animationIn={'slideInUp'}
    onSwipeComplete={() => setVisible(false)}
    swipeDirection={'down'}
    style={{justifyContent: 'flex-end'}}
    isVisible={visible}>
    <View
      style={{
        width: width,
        marginLeft: -20,
        marginBottom: -20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      }}>
<TouchableOpacity
onPress={() => setVisible(false)}
style={{marginVertical:-15,marginBottom:0}}>
<MaterialCommunityIcons name= "drag-horizontal-variant" size={35} color='grey' />
</TouchableOpacity>

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#F0F2F5',
          justifyContent: 'flex-start',
          borderRadius: 10,
        }}>
       {props.item.userId == auth().currentUser.uid ? (
          <TouchableOpacity
            style={{flexDirection: 'row',flex:1,alignItems: 'center',justifyContent: 'flex-start',padding:5}}
            onPress={() => props.onDelete(props.item.id)}>
            <Ionicons
              name={'trash'}
              size={30}
              color="#FF6EA1"
              style={{alignSelf: 'center',marginRight:5}}
            />
            <Text style={{fontSize:16,color:'#7E7E7E'}}>Delete the Post</Text>
          </TouchableOpacity>
        ) : <TouchableOpacity
        style={{flexDirection: 'row',flex:1,alignItems: 'center',justifyContent: 'flex-start',padding:5}}
        onPress={() => props.onSave(props.item.id)}>
        <Ionicons
          name={'bookmark-outline'}
          size={30}
          color="#FF6EA1"
          style={{alignSelf: 'center',marginRight:5}}
        />
        <Text style={{fontSize:16,color:'#7E7E7E'}}>Save to my Bookmarks</Text>
      </TouchableOpacity>}
      </View>
    </View> 
      
  </Modal>
      </TouchableOpacity>
      </View>

      <View
        style={{
          width: width * 0.9,
          height: TEXT_SIZE,
        }}>
        {props.item.post != null ? (
          <Text style={{marginLeft: 10, padding: 5, color: '#333333'}}>
            {props.item.post}
          </Text>
        ) : (
          <View />
        )}
      </View>
      {props.item.postImg != null ? (
        <Image
          style={{
            alignSelf: 'center',
            height: IMAGE_SIZE,
            width: width * 0.9,
            resizeMode: 'cover',
          }}
          source={{uri: props.item.postImg}}
        />
      ) : null}
     {  props.item.comments == 0 && props.item.likes == 0 ?
      null :
      <TouchableOpacity 
       onPress={() => { 
       props.setModalVisible(!props.modalVisible);
                 
       props.setSelectedPost(props.item)
       }}
      style={{width: width * 0.9, height: 25,flexDirection: 'row',margin:7,alignItems:'center',justifyContent: 'space-between'}}>

         {props.item?.likes?.length != 0 ? <View style={{flexDirection: 'row',marginLeft:10}}>
          <EvilIcons name="like" color="#FF6EA1" size={25}/>
<Text style={{alignSelf: 'center',color:'#727375'}}>
            {props.item?.likes?.length == 0
              ? ""
              : props.item?.likes?.length}
          </Text>
          </View>: <View></View>}
          <View style={{flexDirection: 'row',marginRight: 20}}>
        {props.item.comments.length != 0
                &&  <Text style={{alignSelf: 'center', marginLeft: 5,color:'#727375'}}>
            {props.item.comments.length + ' Comments'}
          </Text>}
          </View>
      </TouchableOpacity>}
      <Divider />

     <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          height: 50,

          alignItems:'center',
      
          justifyContent: 'space-between',
          borderRadius: 5,
          shadowColor: '#CBCBCB',
          elevation: 25,
        }}>
        <TouchableOpacity
          onPress={()=>props.likeHandler(props.item.id,props.item.likes)}
          style={{flexDirection: 'row',flex:1,justifyContent: 'center'}}>
          <AntDesign
            name={props.item.likes.includes(auth().currentUser.uid) ? 'like1' : 'like2'}
            size={25}
            color="#FF6EA1"
            
          />
          <Text style={{alignSelf: 'center',marginLeft: 5,fontWeight: 'bold',color:'grey'}}>
            {"Like"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => { console.log("postcarddaki props.item: ",props.item)
            props.setModalVisible(!props.modalVisible);
                      
            props.setSelectedPost(props.item)
            }}
          style={{flexDirection: 'row',flex:1,justifyContent: 'center'}}>
          <Ionicons
            name={'chatbox-outline'}
            size={23}
            color="#FF6EA1"
            
          />
          <Text style={{alignSelf: 'center', marginLeft: 5, fontWeight: 'bold',color:'grey'}}>
            {'Comment'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={()=>setMenu(true)}
          style={{flexDirection: 'row',flex:1,justifyContent: 'center'}}>
          <MaterialCommunityIcons
            name={"share-outline"}
            size={30}
            color="#FF6EA1"
            
          />
          <Text style={{alignSelf: 'center', marginLeft: 5, fontWeight: 'bold',color:'grey'}}>
            {'Share'}
          </Text>
        </TouchableOpacity>
       
      </View>
    </View>
  );
}

export default postCard;
