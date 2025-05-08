// src/i18n/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

const resources = {
  tr: {
    translation: {
      welcome: 'Projeye Hoşgeldiniz',
      register: 'Üye Ol',
      login: 'Giriş Yap',
      changeLanguage: 'İngilizceye Geç',
    },
  },
  en: {
    translation: {
      welcome: 'Welcome to the Project',
      register: 'Register',
      login: 'Login',
      changeLanguage: 'Switch to Turkish',
    },
  },
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (cb) => {
    const locales = RNLocalize.getLocales();
    cb(locales[0]?.languageCode || 'tr');
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'tr',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
