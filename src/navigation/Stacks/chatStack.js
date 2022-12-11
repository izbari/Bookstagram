import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ChatSingleScreen from '../../Pages/ChatSingleScreen';
import NewMessage from '../../Pages/NewMessage';
import VideoCallScreen from '../../Pages/VideoCallScreen';
import ChatScreen from '../../Pages/ChatScreen';
const ChatStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerTitleAlign: 'center',
          title: 'Book Chat',
          headerStyle: {
            backgroundColor: '#FF6EA1',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
        name="ChatScreen"
        component={ChatScreen}
      />
      <Stack.Screen
        options={{
          headerTitleAlign: 'center',
          title: 'New Message',
          headerStyle: {
            backgroundColor: '#FF6EA1',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
        name="NewMessage"
        component={NewMessage}
      />
      <Stack.Screen name="ChatSingleScreen" component={ChatSingleScreen} />
      <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} />
    </Stack.Navigator>
  );
};
export default ChatStack;
