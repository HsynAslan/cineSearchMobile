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
      login_success: 'Giriş başarılı!',
register_success: 'Kayıt başarılı! Giriş yapabilirsiniz.',
email: 'E-posta',
password: 'Şifre',
username: 'Kullanıcı Adı',
no_account: 'Hesabınız yok mu? Kayıt olun',
have_account: 'Zaten hesabınız var mı? Giriş yapın',
success: 'Başarılı',
error: 'Hata',
    },
  },
  en: {
    translation: {
      welcome: 'Welcome to the Project',
      register: 'Register',
      login: 'Login',
      changeLanguage: 'Switch to Turkish',
      login_success: 'Login successful!',
register_success: 'Registration successful! You can now log in.',
email: 'Email',
password: 'Password',
username: 'Username',
no_account: "Don't have an account? Register",
have_account: 'Already have an account? Login',
success: 'Success',
error: 'Error',
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
