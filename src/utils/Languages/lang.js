import I18n from 'react-native-i18n';
import * as RNLocalize from 'react-native-localize';
import {I18nManager} from 'react-native';
import tr from './tr';
import en from './en';
import fr from './fr';
import de from './de';
const locales = RNLocalize.getLocales();
I18n.locale = locales[0].languageTag;
export const isRtl = locales[0].isRTL;
I18nManager.forceRTL(isRtl);
I18n.fallbacks = true;
I18n.locales.no = 'en';
I18n.translations = {
  en,
  tr,
  fr,
  de,
};
export default I18n;
