// src/screens/HomeScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

const HomeScreen = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('welcome')}</Text>
      <View style={styles.buttonContainer}>
        <Button title={t('register')} onPress={() => {}} />
        <Button title={t('login')} onPress={() => {}} />
        <Button title={t('changeLanguage')} onPress={toggleLanguage} />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
});
