/**
 * @format
 */

import {Bootstrapper} from './src/infrastructure/Bootstrapper/Bootstrapper';
import {LanguagesTypes} from './src/infrastructure/Localization/LanguageTypes';
import TranslationEn from './src/resources/localizations/enEn.json';
import TranslationTr from './src/resources/localizations/trTR.json';
import {LogBox} from 'react-native';

Bootstrapper.create()
  .useTranslation(TranslationTr, LanguagesTypes.turkish)
  .useTranslation(TranslationEn, LanguagesTypes.english)
  .useLanguage(LanguagesTypes.english)
  .bootstrap()
  .catch(error => {
    // eslint-disable-next-line no-console
    console.log(error);
  });

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
