import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import {ActivityIndicator, Divider} from 'react-native-paper';
import Image from 'react-native-image-progress';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';
import Flag from 'react-native-flags';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
const {width} = Dimensions.get('window');

import {useTranslation} from 'react-i18next';
import Icon from '../components/Icons';

//import i18n from 'i18next';
function Profile(props) {
  const {t, i18n} = useTranslation();
  const selectedLanguageCode = i18n.language;
  const dispatch = useDispatch();
  const setLanguage = code => {
    return i18n.changeLanguage(code);
  };

  const bs = React.useRef(null);
  const fall = new Animated.Value(1);

  const LANGUAGES = [
    {code: 'tr', label: 'Turkish'},
    {code: 'us', label: 'English'},
    {code: 'de', label: 'Deutschland'},
    {code: 'fr', label: 'French'},
  ];

  const authuser = useSelector(store => store.user);
  const [user, setUser] = React.useState(authuser);
  const [isModalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    setUser(authuser);
  }, [authuser]);

  const signOut = async () => {
    return await auth()
      .signOut()
      .then(() => {
        dispatch({type: 'SET_USER', payload: {user: null}});
        return props.navigation.replace('AuthLoading');
      });
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          height: 40,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name="Drag" size={35} fill="#909090" />
      </View>
    );
  };

  const renderInner = () => (
    <View
      style={{
        backgroundColor: 'white',
        height: '100%',
      }}>
      <View>
        <ScrollView>
          {LANGUAGES.map((language, index) => {
            const selectedLanguage = language.code === selectedLanguageCode;
            return (
              <View style={{flex: 1}} key={language.code}>
                <TouchableOpacity
                  key={language.code}
                  disabled={selectedLanguage}
                  onPress={() => {
                    setLanguage(language.code);
                    setModalVisible(false);
                  }}
                  style={{flex: 1, padding: 10}}>
                  <View
                    style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      <Flag code={language.code.toUpperCase()} size={32} />
                      <Text style={styles.text}>{language.label}</Text>
                    </View>
                    {selectedLanguage ? (
                      <Icon name="CheckMark" size={25} fill="#FF6EA1" />
                    ) : null}
                  </View>
                </TouchableOpacity>
                {index + 1 != LANGUAGES.length && <Divider />}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );

  const Localize = () => {
    return (
      <BottomSheet
        onCloseEnd={() => {
          setModalVisible(false);
        }}
        enabledBottomInitialAnimation={true}
        ref={bs}
        snapPoints={[300, 0]}
        initialSnap={0}
        callbackNode={fall}
        renderContent={renderInner}
        renderHeader={renderHeader}
        enabledGestureInteraction={true}
      />
    );
  };
  const CustomLinearGradient = props => {
    return (
      <LinearGradient gradientUnits="objectBoundingBox" {...props}>
        <Stop offset={0} stopColor="#FF6EA1" />
        <Stop offset={1} stopColor="#FF91B8" />
      </LinearGradient>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.svgCurve}>
        <View
          style={{
            flex: 1,
            height: 180,
          }}>
          <Svg
            id="wave"
            viewBox="0 0 1440 480"
            version="1.1"
            style={{
              position: 'absolute',
              top: -25,
              transform: [{rotate: '180deg'}],
            }}
            xmlns="http://www.w3.org/2000/svg">
            <Defs>
              <CustomLinearGradient
                id="sw-gradient-0"
                x1="50"
                x2="10"
                y1="25"
                y2="25"
              />
            </Defs>
            <Path
              style={{transform: [{rotate: '90deg'}], opacity: 1}}
              fill="url(#sw-gradient-0)"
              d="M0,336L80,304C160,272,320,208,480,176C640,144,800,144,960,176C1120,208,1280,272,1440,288C1600,304,1760,272,1920,272C2080,272,2240,304,2400,288C2560,272,2720,208,2880,224C3040,240,3200,336,3360,352C3520,368,3680,304,3840,304C4000,304,4160,368,4320,384C4480,400,4640,368,4800,360C4960,352,5120,368,5280,368C5440,368,5600,352,5760,312C5920,272,6080,208,6240,192C6400,176,6560,208,6720,224C6880,240,7040,240,7200,216C7360,192,7520,144,7680,144C7840,144,8000,192,8160,224C8320,256,8480,272,8640,280C8800,288,8960,288,9120,264C9280,240,9440,192,9600,200C9760,208,9920,272,10080,248C10240,224,10400,112,10560,96C10720,80,10880,160,11040,168C11200,176,11360,112,11440,80L11520,48L11520,480L11440,480C11360,480,11200,480,11040,480C10880,480,10720,480,10560,480C10400,480,10240,480,10080,480C9920,480,9760,480,9600,480C9440,480,9280,480,9120,480C8960,480,8800,480,8640,480C8480,480,8320,480,8160,480C8000,480,7840,480,7680,480C7520,480,7360,480,7200,480C7040,480,6880,480,6720,480C6560,480,6400,480,6240,480C6080,480,5920,480,5760,480C5600,480,5440,480,5280,480C5120,480,4960,480,4800,480C4640,480,4480,480,4320,480C4160,480,4000,480,3840,480C3680,480,3520,480,3360,480C3200,480,3040,480,2880,480C2720,480,2560,480,2400,480C2240,480,2080,480,1920,480C1760,480,1600,480,1440,480C1280,480,1120,480,960,480C800,480,640,480,480,480C320,480,160,480,80,480L0,480Z"></Path>
            <Defs>
              <CustomLinearGradient
                id="sw-gradient-1"
                x1="25"
                x2="41"
                y1="10"
                y2="10"
              />
            </Defs>
            <Path
              style={{opacity: 0.9}}
              fill="url(#sw-gradient-1)"
              d="M0,384L80,376C160,368,320,352,480,304C640,256,800,176,960,192C1120,208,1280,320,1440,304C1600,288,1760,144,1920,128C2080,112,2240,224,2400,240C2560,256,2720,176,2880,176C3040,176,3200,256,3360,248C3520,240,3680,144,3840,128C4000,112,4160,176,4320,192C4480,208,4640,176,4800,192C4960,208,5120,272,5280,304C5440,336,5600,336,5760,288C5920,240,6080,144,6240,152C6400,160,6560,272,6720,304C6880,336,7040,288,7200,224C7360,160,7520,80,7680,104C7840,128,8000,256,8160,280C8320,304,8480,224,8640,224C8800,224,8960,304,9120,312C9280,320,9440,256,9600,256C9760,256,9920,320,10080,304C10240,288,10400,192,10560,176C10720,160,10880,224,11040,280C11200,336,11360,384,11440,408L11520,432L11520,480L11440,480C11360,480,11200,480,11040,480C10880,480,10720,480,10560,480C10400,480,10240,480,10080,480C9920,480,9760,480,9600,480C9440,480,9280,480,9120,480C8960,480,8800,480,8640,480C8480,480,8320,480,8160,480C8000,480,7840,480,7680,480C7520,480,7360,480,7200,480C7040,480,6880,480,6720,480C6560,480,6400,480,6240,480C6080,480,5920,480,5760,480C5600,480,5440,480,5280,480C5120,480,4960,480,4800,480C4640,480,4480,480,4320,480C4160,480,4000,480,3840,480C3680,480,3520,480,3360,480C3200,480,3040,480,2880,480C2720,480,2560,480,2400,480C2240,480,2080,480,1920,480C1760,480,1600,480,1440,480C1280,480,1120,480,960,480C800,480,640,480,480,480C320,480,160,480,80,480L0,480Z"></Path>
          </Svg>
          <View style={{flexDirection: 'row', margin: 10, marginBottom: 0}}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Icon
                name="BackArrow"
                size={30}
                fill="white"
                style={{marginLeft: 5, marginRight: 5, marginTop: 5}}
              />
            </TouchableOpacity>

            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 20,
                marginLeft: 5,
                marginRight: 5,
                marginTop: 7,
              }}>
              {t('common:Hello')}
              {!!user
                ? ' ' +
                  user.name[0].toUpperCase() +
                  user.name.substring(1, user.name.length) +
                  ' ' +
                  user.lastName[0].toUpperCase() +
                  user.lastName.substring(1, user.lastName.length)
                : 'user cant found'}
            </Text>
          </View>

          <View style={{flexDirection: 'row'}}>
            <View style={styles.profileStatusContainer}>
              <Text style={styles.profileStatusNumber}>
                {!!user ? user.books.length : '1000'}
              </Text>
              <Text style={styles.profileStatusText}>{t('common:Books')}</Text>
            </View>

            <TouchableOpacity style={styles.profileStatusContainer}>
              <Text style={styles.profileStatusNumber}>
                {!!user && user?.fallowers
                  ? Object.keys(user.fallowers ?? {}).length
                  : '1000'}
              </Text>
              <Text style={styles.profileStatusText}>
                {t('common:Followers')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileStatusContainer}>
              <Text style={styles.profileStatusNumber}>
                {!!user && user?.fallowing
                  ? Object.keys(user.fallowing ?? {}).length
                  : '1001'}
              </Text>
              <Text style={styles.profileStatusText}>
                {t('common:Following')}
              </Text>
            </TouchableOpacity>
            <Image
              style={{
                position: 'relative',
                left: 50,
                top: 10,
                height: 90,
                width: 90,
                resizeMode: 'contain',
                borderRadius: 50,
                overflow: 'hidden',
                elavation: 5,
              }}
              source={{
                uri: user.imageUrl,
              }}
            />
          </View>
        </View>
      </View>

      <View
        style={{
          width: '85%',
          height: '30%',
          alignSelf: 'center',
          marginTop: 180,
          shadowColor: '#CBCBCB',
          borderRadius: 2,
          elevation: 80,
        }}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('EditProfile', {user: user})}
          style={{
            width: width * 0.85,
            height: 30,
            marginBottom: 25,
            backgroundColor: '#FF6EA1',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: 12,
            }}>
            {t('common:EditProfile')}
          </Text>
        </TouchableOpacity>
        <Text style={{color: '#C4C4C4', fontWeight: 'bold', padding: 5}}>
          {t('common:Account')}
        </Text>
        <View>
        <TouchableOpacity
            onPress={() => props.navigation.navigate('MyStoreTab')}
            style={styles.menuRow}>
            <Icon name="Card" size={25} fill="#FF6EA1" />
            <Text style={styles.text}>{t('common:MyStore')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Store')}
            style={styles.menuRow}>
            <Icon name="Card" size={25} fill="#FF6EA1" />
            <Text style={styles.text}>{t('common:MyCart')}</Text>
          </TouchableOpacity>
          <Svg height="2" width={width}></Svg>
          <TouchableOpacity style={styles.menuRow}>
            <Icon name="CreditCard" size={25} fill="#FF6EA1" />
            <Text style={styles.text}>{t('common:Purchases')}</Text>
          </TouchableOpacity>
          <Svg height="2" width={width}></Svg>
          <TouchableOpacity style={styles.menuRow}>
            <Icon name="User" size={25} fill="#FF6EA1" />
            <Text style={styles.text}>{t('common:Account')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          width: '85%',
          height: '30%',
          alignSelf: 'center',
          shadowColor: '#CBCBCB',
          borderRadius: 2,
          marginTop: 80,
          elevation: 80,
        }}>
        <View>
          <TouchableOpacity style={styles.menuRow}>
            <Icon name="Theme" size={25} fill="black" />
            <Text style={styles.text}>{t('common:Theme')}</Text>
          </TouchableOpacity>
          <Svg height="2" width={width}></Svg>
          <TouchableOpacity style={styles.menuRow}>
            <Icon name={'Notification'} size={25} fill="#FF6EA1" />
            <Text style={styles.text}>{t('common:Notifications')}</Text>
          </TouchableOpacity>
          <Svg height="2" width={width}></Svg>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.menuRow}>
            <Icon name="Language" size={25} fill="#FF6EA1" />
            <Text style={styles.text}>{t('common:Languages')}</Text>
          </TouchableOpacity>
          <Svg height="2" width={width}></Svg>

          <TouchableOpacity onPress={() => signOut()} style={styles.menuRow}>
            <Icon name="Logout" size={25} fill="#FF6EA1" />
            <Text style={styles.text}>{t('common:SignOut')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{width: '100%', height: '50%'}}>
          {isModalVisible && <Localize />}
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#FBFAFA'},
  text: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: 25,
  },
  menuRow: {flexDirection: 'row', backgroundColor: 'white', padding: 10},
  svgCurve: {
    position: 'absolute',
    width: Dimensions.get('window').width,
  },
  profileStatusNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#818182',
    textAlign: 'center',
  },
  profileStatusContainer: {
    margin: 20,
    marginTop: 60,
    marginRight: 0,
    marginLeft: 40,
  },
  profileStatusText: {
    fontSize: 8,
    color: '#8E8E8F',
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default Profile;
