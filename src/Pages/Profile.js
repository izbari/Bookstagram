import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {Divider} from 'react-native-paper';
import Image from 'react-native-image-progress';
import Flag from 'react-native-flags';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
const {width} = Dimensions.get('window');

import {useTranslation} from 'react-i18next';
import Icon from '../components/Icons';
import Svg from 'react-native-svg';
import tw from 'twrnc';
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

  const authuser = useSelector(store => store.user.user);
  const [user, setUser] = React.useState(authuser);
  const [isModalVisible, setModalVisible] = React.useState(false);
  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      title:
        t('common:Hello') +
        ' ' +
        user?.name?.[0].toUpperCase() +
        user?.name?.substring(1, user?.name.length),
    });
  }, [props.navigation, t, i18n, user]);
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

  const ProfileInfoSection = () => {
    return (
      <View style={{margin: 10, padding: 10}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View
            style={{
              marginBottom: 10,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 30,
              }}>
              <View style={styles.profileStatusContainer}>
                <Text style={styles.profileStatusNumber}>
                  {!!user ? user.books?.length : '1000'}
                </Text>
                <Text style={styles.profileStatusText}>
                  {t('common:Books')}
                </Text>
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
            </View>
            <Image
              resizeMode="contain"
              style={tw`w-17 h-17 rounded-full overflow-hidden`}
              source={{
                uri: user.imageUrl,
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('EditProfile', {user: user})}
          style={{
            height: 30,
            backgroundColor: '#FF6EA1',
            justifyContent: 'center',
            borderRadius: 5,
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
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView>
        <ProfileInfoSection />
        <View
          style={{
            marginHorizontal: 20,
            marginVertical: 10,
          }}>
          <Text style={{color: '#C4C4C4', fontWeight: 'bold', padding: 5}}>
            {t('common:Account')}
          </Text>
          <View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('BookTab')}
              style={styles.menuRow}>
              <Icon name="Card" size={25} fill="#FF6EA1" />
              <Text style={styles.text}>{t('common:MyCart')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRow}>
              <Icon name="CreditCard" size={25} fill="#FF6EA1" />
              <Text style={styles.text}>{t('common:Purchases')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRow}>
              <Icon name="User" size={25} fill="#FF6EA1" />
              <Text style={styles.text}>{t('common:Account')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{marginHorizontal: 20, marginVertical: 10}}>
          <Text style={{color: '#C4C4C4', fontWeight: 'bold', padding: 5}}>
            {t('common:Settings')}
          </Text>
          <View>
            <TouchableOpacity style={styles.menuRow}>
              <Icon name="Theme" size={25} fill="black" />
              <Text style={styles.text}>{t('common:Theme')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRow}>
              <Icon name={'Notification'} size={25} fill="#FF6EA1" />
              <Text style={styles.text}>{t('common:Notifications')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.menuRow}>
              <Icon name="Language" size={25} fill="#FF6EA1" />
              <Text style={styles.text}>{t('common:Languages')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => signOut()} style={styles.menuRow}>
              <Icon name="Logout" size={25} fill="#FF6EA1" />
              <Text style={styles.text}>{t('common:SignOut')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{width: '100%', height: '50%'}}>
            {isModalVisible && <Localize />}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#fff'},
  text: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: 25,
  },
  menuRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },

  profileStatusNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#818182',
    textAlign: 'center',
  },
  profileStatusContainer: {marginRight: 15},
  profileStatusText: {
    fontSize: 8,
    color: '#8E8E8F',
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default Profile;
