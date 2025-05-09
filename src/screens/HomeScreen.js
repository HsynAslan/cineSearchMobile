// src/screens/HomeScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const videoRef = useRef(null);

  // Set default language and persist preference
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const lang = await AsyncStorage.getItem('userLanguage');
        if (lang) {
          i18n.changeLanguage(lang);
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      }
    };
    loadLanguagePreference();
  }, [i18n]);

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(newLang);
    try {
      await AsyncStorage.setItem('userLanguage', newLang);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Video Background */}
      <Video
        source={require('../assets/videos/background.mp4')} // You need to add this video file
        ref={videoRef}
        style={styles.backgroundVideo}
        muted={true}
        repeat={true}
        resizeMode="cover"
        rate={1.0}
        ignoreSilentSwitch="obey"
      />

      {/* Overlay */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Language Toggle Button - Top Right */}
        <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
          <Icon name="language" size={24} color="#fff" />
          <Text style={styles.languageText}>
            {i18n.language === 'tr' ? 'EN' : 'TR'}
          </Text>
        </TouchableOpacity>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{t('welcome')}</Text>
          <Text style={styles.subtitle}>Film & Dizi Platformu</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.registerButton]}
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={styles.buttonText}>{t('register')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.buttonText}>{t('login')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  safeArea: {
    flex: 1,
  },
  languageButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: 10,
  },
  languageText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: windowHeight * 0.1,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  registerButton: {
    backgroundColor: 'rgba(229, 9, 20, 0.9)', // Netflix red
  },
  loginButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
