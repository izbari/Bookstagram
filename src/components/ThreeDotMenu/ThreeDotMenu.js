import {View, TouchableOpacity} from 'react-native';
import {Menu, Divider} from 'react-native-paper';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

const RightMenu = props => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  return (
    <View style={{flexDirection: 'row', justifyContent: 'center',position:"absolute",right:props?.comment ? 0: 10,top:props?.comment? -10: 5}}>
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
              size={props?.comment ? 20 : 25}
              color="grey"
            />
          </TouchableOpacity>
        }>
        <Menu.Item
          icon={
            props?.whosePost == auth().currentUser.uid
              ? 'delete'
              : 'bookmark-multiple'
          }
          onPress={() => {
            props?.whosePost == auth().currentUser.uid
              ? props.onDelete(props.itemId)
              : props.onSave(props.itemId);
          }}
          title={
            props?.whosePost == auth().currentUser.uid
              ? 'Delete My Post'
              : 'Add to Saved Posts '
          }
          titleStyle={{fontSize: 14}}
        />
        <Divider />
        <Menu.Item
          icon="close"
          onPress={() => {}}
          title="Hide the Post"
          titleStyle={{fontSize: 14}}
        />
      </Menu>
    </View>
  );
};
export default RightMenu;
