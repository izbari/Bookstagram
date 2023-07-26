import i18n, {Resource} from 'i18next';
import {initReactI18next} from 'react-i18next';
import {AppRegistry} from 'react-native';
import {name as appName} from '../../../app.json';
import {LanguagesTypes} from '../Localization/LanguageTypes';
import App from '../../../App';

export class Bootstrapper {
  public static create(): Bootstrapper {
    return new Bootstrapper();
  }

  private _translations: Resource = {};
  private _language: LanguagesTypes = LanguagesTypes.english;

  public async bootstrap(): Promise<void> {
    await this.initLocalization();

    AppRegistry.registerComponent(appName, () => App);
  }
  public useTranslation(
    translation: Resource,
    language: LanguagesTypes,
  ): Bootstrapper {
    this._translations[language] = translation;
    return this;
  }
  public useLanguage(language: LanguagesTypes): Bootstrapper {
    this._language = language;
    return this;
  }
  private async initLocalization(): Promise<void> {
    await i18n.use(initReactI18next).init({
      compatibilityJSON: 'v3',
      resources: this._translations,
      lng: this._language,
      fallbackLng: LanguagesTypes.english,
      debug: true,
      interpolation: {
        escapeValue: false,
      },
    });
  }
}
