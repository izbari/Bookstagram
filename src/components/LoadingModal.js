import React from 'react';
import {View, Modal, StyleSheet, Text} from 'react-native';
import Loading from './Loading';
import {generateRandomColor} from '../utils/randomColor';
export function LoadingModal({modalVisible, task, value}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Loading />
          {/* <ActivityIndicator size="large" color={'#FF6EA1'} style={{transform:[{scale:1.7}]}}/> */}
          {task ? (
            <Text
              style={[styles.modalText, value === 100 && {color: '#007fff'}]}>
              {task}
            </Text>
          ) : (
            <Text style={[styles.modalText, {color: generateRandomColor()}]}>
              Loading.. {title}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0008',
  },
  modalView: {
    width: 175,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10,
  },

  modalText: {
    marginVertical: 15,
    textAlign: 'center',
    fontSize: 24,
    marginLeft: 15,
    position: 'absolute',
    color: 'black',
    fontWeight: 'bold',
  },
});
