import {View, TouchableOpacity} from 'react-native';
import {Menu, Divider} from 'react-native-paper';
import React from 'react';
import auth from '@react-native-firebase/auth';
import {useDispatch} from 'react-redux';

import Icon from '../../components/Icons';
const RightMenu = props => {
  const dispatch = useDispatch();
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        right: props?.comment ? 0 : 10,
        top: props?.comment ? -10 : 5,
      }}>
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
            <Icon
              style={{alignSelf: 'center'}}
              name="Threedot"
              size={props?.comment ? 25 : 30}
              fill="grey"
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
            closeMenu();
            props?.whosePost != auth().currentUser.uid
              ? dispatch({type: 'SAVE_POST', payload: {itemId:props.itemId}})
              : dispatch({type: 'DELETE_POST', payload: {postId:props.itemId}});

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
