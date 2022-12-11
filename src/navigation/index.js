import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ReduxProvier from '../context/Provider';

import AddTopics from '../Pages/AddTopics';
import SingleBookDesc from '../Pages/SingleBookDesc';
import AuthLoading from '../Pages/AuthLoading';
import {Provider as ThemeProvider, DefaultTheme} from 'react-native-paper';

import Onboarding from '../Pages/Onboarding';
import AuthStack from './Stacks/authStack';
import SocialMediaTab from './Tabs/SocialMediaTab';
import BookTab from './Tabs/BookTab';

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ReduxProvier>
        <NavigationContainer>
          <Stack.Navigator options={{headerShown: false}}>
            <Stack.Screen
              options={{headerShown: false}}
              name="AuthLoading"
              component={AuthLoading}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="AuthStack"
              component={AuthStack}
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="Onboarding"
              component={Onboarding}
            />

            <Stack.Screen
              options={{headerShown: false}}
              name="SocialMediaTab"
              component={SocialMediaTab}
            />

            <Stack.Screen
              options={{headerShown: false}}
              name="BookTab"
              component={BookTab}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="SingleBookDesc"
              component={SingleBookDesc}
            />
            <Stack.Screen
              options={{headerShown: false}}
              name="AddTopics"
              component={AddTopics}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ReduxProvier>
    </ThemeProvider>
  );
}

export default App;
