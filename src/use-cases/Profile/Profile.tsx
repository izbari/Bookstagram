import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../resources/constants/Colors';
const {width} = Dimensions.get('window');

import {useTranslation} from 'react-i18next';
import tw from 'twrnc';
import {RouteProp} from '@react-navigation/native';
import {NavigationParamsList} from '../../components/navigation/NavigationParamsList';
import {RouteNames} from '../../components/navigation/RouteNames';
import {IWithNavigation} from '../../components/navigation/Types';
type IProfileProps = IWithNavigation<RouteNames.profile>;
//import i18n from 'i18next'
export const Profile: React.FunctionComponent<IProfileProps> = props => {
  const {t, i18n} = useTranslation();
  const selectedLanguageCode = i18n.language;
  const dispatch = useDispatch();
  const setLanguage = code => {
    return i18n.changeLanguage(code);
  };

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ['25%', '30%'], []);

  const LANGUAGES = [
    {code: 'tr', label: 'Turkish'},
    {code: 'us', label: 'English'}
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
                      {/* <Flag code={language.code.toUpperCase()} size={32} /> */}
                      <Text style={styles.text}>{language.label}</Text>
                    </View>
                    {/* {selectedLanguage ? (
                    //   <Icon name="CheckMark" size={25} fill="#FF6EA1" />
                    ) : null} */}
                  </View>
                </TouchableOpacity>
                {index + 1 != LANGUAGES.length && (
                  <View style={tw`bg-gray-400 h-1.5`} />
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );

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
                  {t('profile.books')}
                </Text>
              </View>

              <TouchableOpacity style={styles.profileStatusContainer}>
                <Text style={styles.profileStatusNumber}>
                  {!!user && user?.fallowers
                    ? Object.keys(user.fallowers ?? {}).length
                    : '1000'}
                </Text>
                <Text style={styles.profileStatusText}>
                  {t('profile.followers')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileStatusContainer}>
                <Text style={styles.profileStatusNumber}>
                  {!!user && user?.fallowing
                    ? Object.keys(user.fallowing ?? {}).length
                    : '1001'}
                </Text>
                <Text style={styles.profileStatusText}>
                  {t('profile.following')}
                </Text>
              </TouchableOpacity>
            </View>
            <Image
              resizeMode="contain"
              style={tw`w-17 h-17 rounded-full overflow-hidden bg-black-500`}
              source={{
                uri: user ? user.imageUrl : 'https://picsum.photos/200',
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('EditProfile', {user: user})}
          style={tw`bg-[${Colors.darkPurple}] rounded-md p-2`}>
          <Text style={tw`text-white text-center font-bold text-sm`}>
            {t('profile.edit-profile')}
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
            {t('profile.account')}
          </Text>
          <View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate(RouteNames.myStore)}
              style={styles.menuRow}>
              <MaterialIcon
                name="store-mall-directory"
                size={25}
                color={Colors.darkPurple}
              />
              <Text style={styles.text}>{t('profile.my-store')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('BookTab')}
              style={styles.menuRow}>
              <Icon name="cart" size={25} color={Colors.darkPurple} />
              <Text style={styles.text}>{t('profile.cart')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRow}>
              <Icon name="card" size={25} color={Colors.darkPurple} />
              <Text style={styles.text}>{t('profile.purchases')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRow}>
              <Icon name="settings" size={25} color={Colors.darkPurple} />
              <Text style={styles.text}>{t('profile.account-settings')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{marginHorizontal: 20, marginVertical: 10}}>
          <Text style={{color: '#C4C4C4', fontWeight: 'bold', padding: 5}}>
            {t('profile.settings')}
          </Text>
          <View>
            <TouchableOpacity style={styles.menuRow}>
              <Icon name="ellipse" size={25} color="black" />
              <Text style={styles.text}>{t('profile.theme')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuRow}>
              <Icon name="notifications" size={25} color={Colors.darkPurple} />
              <Text style={styles.text}>{t('profile.notifications')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={bottomSheetRef.current?.expand}
              style={styles.menuRow}>
              <Icon name="language-sharp" size={25} color={Colors.darkPurple} />
              <Text style={styles.text}>{t('profile.languages')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => signOut()} style={styles.menuRow}>
              <Icon
                name="log-out-outline"
                size={25}
                color={Colors.darkPurple}
              />
              <Text style={styles.text}>{t('profile.sign-out')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
        <BottomSheetView style={tw`h-full justify-evenly `}>
          <TouchableOpacity
            onPress={() => {
              i18n.changeLanguage('us');
              bottomSheetRef.current?.close();
            }}
            style={tw`pl-8 `}>
            <Text style={tw`text-lg text-black font-semibold`}>
              {"🇬🇧    " + t('profile.english')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              i18n.changeLanguage('tr');
              bottomSheetRef.current?.close();
            }}
            style={tw`pl-8`}>
            <Text style={tw`text-lg text-black font-semibold`}>
            
              {"🇹🇷    " + t('profile.turkish')}
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};
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
