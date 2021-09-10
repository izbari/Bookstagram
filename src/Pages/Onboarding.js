import React from 'react';

import {SafeAreaView, View, Text, Button,Flatlist, FlatList} from 'react-native';
import slides from './onboarding_data';
import OnboardingItem from './OnboardingItem'
function Onboarding(props) {
  return (<SafeAreaView style={{flex: 1,}} >

    <FlatList 
    
    data={slides}
    renderItem={({item})=> <OnboardingItem item={item}/>}
    keyExtractor={(item)=>item.id}
    
    
    
    />






  </SafeAreaView>)
}
export default Onboarding;
