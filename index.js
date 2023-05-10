/**
 * @format
 */

import {Bootstrapper} from './src/infrastructure/Bootstrapper/Bootstrapper';
import {LanguagesTypes} from './src/infrastructure/Localization/LanguageTypes';
import {Provider} from 'react-redux';
import {store} from './src/infrastructure/Redux/Store';
import TranslationEn from './src/resources/localizations/enEn.json';
import TranslationTr from './src/resources/localizations/trTR.json';
import LandingPage from './src/use-cases/Landing/LandingPage';
export const App = () => {
  return (
    <Provider store={store}>
      <LandingPage />
    </Provider>
  );
};
Bootstrapper.create()
  .useTranslation(TranslationTr, LanguagesTypes.turkish)
  .useTranslation(TranslationEn, LanguagesTypes.english)
  .useLanguage(LanguagesTypes.turkish)
  .bootstrap()
  .catch(error => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
