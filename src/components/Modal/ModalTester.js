import React, {useState} from 'react';
import {
 
  Keyboard,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  FlatList,
  RefreshControl
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Image from 'react-native-image-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const {width,height2} = Dimensions.get('window')

import moment from 'moment';
function ModalTester(props) {
  
  const [height, setHeight] = React.useState(0);
  const [postText, setPostText] = React.useState('');
 
  const comment = ({item}) => {
    return (
        <View style={{flexDirection: 'row',width:width,marginVertical:10}}>
          <Image
            style={{
              height: 40,
              width: 40,
              resizeMode: 'contain',
              borderRadius: 50,
              overflow: 'hidden',
              elavation: 5,
              marginRight: 7,
            }}
            source={{
              uri: item.img,
            }}
          />
          <View>
            <View
              style={{
                backgroundColor: '#E4E6E9',
                borderRadius: 20,
                width: width * 0.72,
              }}>
              <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
              <Text style={{fontWeight: 'bold', padding: 10, paddingBottom: 2}}>
                {item.name}
              </Text>         
              <View>
              <RightMenu />
              </View>
              </View>

              <View style={{padding: 15, paddingTop: 0, paddingLeft: 10}}>
                <Text>{item.comment}</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 10,
                width: 200,
                padding: 5,
              }}>
              <Text style={{color: 'grey', fontSize: 12}}>
                {moment(item.postTime).fromNow()}
              </Text>
              <TouchableOpacity>
                <Text style={{color: 'grey', fontSize: 12, fontWeight: 'bold'}}>
                  Like
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={{color: 'grey', fontSize: 12, fontWeight: 'bold'}}>
                  Reply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      
    );
  };

  return (
    <Modal
    deviceHeight={height2}
    deviceWidth={width}
    swipeThreshold={10}
    onBackButtonPress={()=>props.setModalVisible(false)}
    useNativeDriver={true}
                propagateSwipe={true}
      animationIn={'slideInUp'}
      onSwipeComplete={() => props.setModalVisible(false)}
      swipeDirection={'down'}
      style={{justifyContent: 'flex-end'}}

      isVisible={props.modalVisible}>
      <View
        style={{
          width: width,
          marginLeft: -20,
          marginBottom: -20,
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 30,
          
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
  onPress={() => props.setModalVisible(false)}
  style={{marginVertical:-15,marginBottom:0}}>
  <Icon name= "drag-horizontal-variant" size={35} color='grey' />
  </TouchableOpacity>
<FlatList
          ListEmptyComponent={      <View style={{margin:30,marginTop:10}}>
            <Text style={{fontSize:18,color:'grey'}}>No comments found</Text>
          </View>
        }
          data={props.selectedPostComments.comments}
          renderItem={comment}
          extraData={props.selectedPostComments.comments}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F0F2F5',
            alignItems: 'flex-end',
            borderRadius: 10,
          }}>
        
          <TextInput
          autoFocus={true}
            onContentSizeChange={event => {
              setHeight(event.nativeEvent.contentSize.height);
            }}
            style={{
              height: Math.max(45, height),
              padding: 10,
              margin: 2,
              flex: 1,
            }}
            value={postText}
            multiline
            autoCorrect
            numberOfLines={7}
            placeholder={'What are u thinking ?'}
            onChangeText={setPostText}></TextInput>
          <TouchableOpacity onPress={async () => {const text=postText;
                                              await props.submitComment(text);
                                              setPostText('');
                                              props.setModalVisible(false)
                                              Keyboard.dismiss();
                                              setHeight(45);
                                              }}>
            <Icon name="send" size={25} color="#FF6EA1" style={{padding: 10,}} />
          </TouchableOpacity>
        </View>
      </View> 
        
    </Modal>

  );
}

export default ModalTester;
