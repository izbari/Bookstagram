import { View,ScrollView } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const skeletonPlaceholder = () => {
  return (
    <ScrollView
    style={{flex: 1}}
    contentContainerStyle={{alignItems: 'center'}}>
    <SkeletonPlaceholder>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          marginLeft: 5,
        }}>
        <View
          style={{
            height: 60,
            width: 60,

            borderRadius: 50,
          }}
        />
        <View style={{marginLeft: 20}}>
          <View style={{width: 120, height: 20, borderRadius: 4}} />
          <View
            style={{marginTop: 6, width: 80, height: 15, borderRadius: 4}}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
          borderRadius: 4,
          width: 300,
          height: 20,
        }}
      />
      <View
        style={{
          marginTop: 6,
          width: 250,
          height: 20,
          borderRadius: 4,
        }}
      />
      <View
        style={{
          marginTop: 6,
          width: 350,
          height: 200,
          marginTop: 10,
          borderRadius: 4,
        }}
      />
    </SkeletonPlaceholder>
    <SkeletonPlaceholder>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          marginLeft: 5,
        }}>
        <View
          style={{
            height: 60,
            width: 60,

            borderRadius: 50,
          }}
        />
        <View style={{marginLeft: 20}}>
          <View style={{width: 120, height: 20, borderRadius: 4}} />
          <View
            style={{marginTop: 6, width: 80, height: 15, borderRadius: 4}}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
          borderRadius: 4,
          width: 300,
          height: 20,
        }}
      />
      <View
        style={{
          marginTop: 6,
          width: 250,
          height: 20,
          borderRadius: 4,
        }}
      />
      <View
        style={{
          marginTop: 6,
          width: 350,
          height: 200,
          marginTop: 10,
          borderRadius: 4,
        }}
      />
    </SkeletonPlaceholder>
    <SkeletonPlaceholder>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          marginLeft: 5,
        }}>
        <View
          style={{
            height: 60,
            width: 60,

            borderRadius: 50,
          }}
        />
        <View style={{marginLeft: 20}}>
          <View
            style={{
              width: 120,
              height: 20,
              borderRadius: 4,
              marginTop: 20,
            }}
          />
          <View
            style={{marginTop: 6, width: 80, height: 15, borderRadius: 4}}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: 10,
          borderRadius: 4,
          width: 300,
          height: 20,
        }}
      />
      <View
        style={{
          marginTop: 6,
          width: 250,
          height: 20,
          borderRadius: 4,
        }}
      />
      <View
        style={{
          marginTop: 6,
          width: 350,
          height: 200,
          marginTop: 10,
          borderRadius: 4,
        }}
      />
    </SkeletonPlaceholder>
  </ScrollView>
  );
};

export default skeletonPlaceholder;
