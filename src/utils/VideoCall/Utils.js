import {mediaDevices} from 'react-native-webrtc';
import {Text, View} from 'react-native';
import React, {Component} from 'react';

  exports.getStream = async ()=> {
    console.log("get streama girdi utils ");
    let isFront = true;
    const sourceInfos = await mediaDevices.enumerateDevices();
    console.log(sourceInfos);
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if (
        sourceInfo.kind == 'videoinput' &&
        sourceInfo.facing == (isFront ? 'front' : 'environment')
      ) {
        videoSourceId = sourceInfo.deviceId;
      }
    }
    console.log("stream ustu");
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 640,
        height: 480,
        frameRate: 30,
        facingMode: isFront ? 'user' : 'environment',
        deviceId: videoSourceId,
      },
    });
    console.log("stream altı");

    console.log("ifin iç booleanı ",typeof stream != 'boolean');
    if (typeof stream != 'boolean') {
      console.log("utils calisiyo", stream);
      return stream; 
    }else{
      console.log("utils calismiyo!!", stream);

      return null;
    }

    
  }

