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

import {Menu, Divider, Provider as PaperProvider} from 'react-native-paper';

const {width} = Dimensions.get('window');

function postCard(props) {
  const TEXT_SIZE =
    props.item.post != null
      ? Math.round(props.item.post.length / 40.0) * 20 + 10
      : 5;

  const [user, setUser] = React.useState({});

  const IMAGE_SIZE = props.item.postImg != null ? 250 : 5;
  React.useEffect(async () => {
    await database()
      .ref(`/users/${props.item.userId}`)
      .once('value')
      .then(snapshot => {
        setUser(snapshot.val());
      });
  }, [props.item.userId]);

  const RightMenu = () => {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    return (
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignContent: 'center',
                width: 50,
                height: 50,
              }}
              title="dot"
              onPress={openMenu}>
              <Ionicons
                style={{alignSelf: 'center'}}
                name="ellipsis-horizontal"
                size={25}
                color="grey"
              />
            </TouchableOpacity>
          }>
          <Menu.Item
            icon="delete"
            onPress={() => {}}
            title="Clear Chat"
            titleStyle={{fontSize: 14}}
          />
          <Divider />
          <Menu.Item
            icon="cog"
            onPress={() => {}}
            title="Settings"
            titleStyle={{fontSize: 14}}
          />
        </Menu>
      </View>
    );
  };

  return (
  <View></View>
  );
}

export default postCard;
