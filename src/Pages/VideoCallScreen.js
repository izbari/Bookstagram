import {StyleSheet, View} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {
  mediaDevices,
  RTCPeerConnection,
  EventOnAddStream,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import firestore from '@react-native-firebase/firestore';

import GettingCall from '../components/VideoCall/GettingCall';
import CustomButton from '../components/VideoCall/Button';
import Video from '../components/VideoCall/Video';
import Utils from '../utils/VideoCall/Utils';

const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
const VideoCallScreen = ({navigation, route}) => {
  

  const {chatId, imageUrl,name,uid} = route.params;

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [gettingCall, setGettingCall] = useState(false);
  const pc = useRef(null);
  const connecting = useRef(false);

  useEffect(() => {
    const cRef = firestore().collection('meet').doc(chatId);

    const subscribe = cRef.onSnapshot(snapshot => {
      const data = snapshot.data();

      //on answer start the call
      if (pc.current && !pc.current.remoteDescription && data && data.answer) {
        pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }

      if (data && data.offer && !connecting.current) {
        setGettingCall(true);

      }
    });

    //on delete  of collection call hangup
    // the other side  has clicked on hangup

    const subscribeDelete = cRef.collection('callee').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type == 'removed') {
          hangup();
        }
      });
    });
    return () => {
      subscribe();
      subscribeDelete();
    };
  }, []);

  const setupWebrtc = async () => {
    pc.current = new RTCPeerConnection(configuration);

    // get audio and video  stream  for the call
    const stream = await Utils.getStream();

    if (stream) {
      setLocalStream(stream);
      pc.current.addStream(stream);
    }

    // get the remote  stream once  it is available
    pc.current.onaddstream = event => {
      setRemoteStream(event.stream);
    };
  };
  const create = async () => {
    console.log('calling');
    connecting.current = true;
    //set up webrtc
    await setupWebrtc();

    //doc for call
    const cRef = firestore().collection('meet').doc(chatId);

    collectIceCandidates(cRef, 'caller', 'callee');

    if (pc.current) {
      const offer = await pc.current.createOffer();
      pc.current.setLocalDescription(offer);

      const cWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
          user:{imageUrl:imageUrl,name:name,id:uid},
        },
      };
      cRef.set(cWithOffer);
    }
  };
  const join = async () => {
    console.log('Joining the call');
    connecting.current = true;
    setGettingCall(false);

    const cRef = firestore().collection('meet').doc(chatId);
    const offer = (await cRef.get()).data()?.offer;

    if (offer) {
      console.log('offer edildi!! ');
      await setupWebrtc();
      collectIceCandidates(cRef, 'callee', 'caller');

      if (pc.current) {
        pc.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.current.createAnswer();
        pc.current.setLocalDescription(answer);

        const cWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        };
        cRef.update(cWithAnswer);
      }
    }
  };
  const hangup = async () => {
    setGettingCall(false);
    connecting.current = false;
    streamCleanUp();
    firestoreCleanUp();

    if (pc.current) {
      pc.current.close();
    }
    navigation.navigate('ChatSingleScreen', {chatId:
      chatId,name:name,imageUrl:imageUrl,uid:uid});

  };

  //helper functions
  const collectIceCandidates = async (cRef, localName, remoteName) => {
    const candidateCollection = cRef.collection(localName);
    if (pc.current) {
      pc.current.onicecandidate = event => {
        if (event.candidate) {
          candidateCollection.add(event.candidate);
        }
      };
    }
    cRef.collection(remoteName).onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type == 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.current?.addIceCandidate(candidate);
        }
      });
    });
  };

  const streamCleanUp = async () => {
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
      localStream.release();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };
  const firestoreCleanUp = async () => {
    const cRef = firestore().collection('meet').doc(chatId);

    if (cRef) {
      const calleeCandidate = await cRef.collection('callee').get();
      calleeCandidate.forEach(async candidate => {
        await candidate.ref.delete();
      });

      const callerCandidate = await cRef.collection('caller').get();
      callerCandidate.forEach(async candidate => {
        await candidate.ref.delete();
      });
      cRef.delete();
    }
  };

  if (gettingCall) {
    return (
      <GettingCall
        imageUrl={imageUrl}
        join={() => join()}
        hangup={() => hangup()}
      />
    );
  }
  if (localStream) {
    return (
      <Video
        localStream={localStream}
        remoteStream={remoteStream}
        hangup={() => hangup()}
      />
    );
  }
  return (
    <View style={styles.container}>
      <CustomButton iconName="video" backgroundColor="grey" onPress={create} />
    </View>
  );
};

export default VideoCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
