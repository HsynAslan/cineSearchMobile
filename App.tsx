// App.js

import React from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './src/i18n/i18n';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <HomeScreen />
    </I18nextProvider>
  );
}
