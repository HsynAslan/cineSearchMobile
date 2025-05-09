import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../utils/config';
const LoginScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://${API_BASE_URL}/api/login', {
        email,
        password,
      });

      if (response.data.success && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        Alert.alert(t('success'), t('login_success'));
        navigation.navigate('Profile'); // veya ana ekran
      } else {
        Alert.alert(t('error'), response.data.message || t('login_failed'));
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t('error'), t('something_went_wrong'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('login')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('email')}
        placeholderTextColor="#aaa"
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder={t('password')}
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{t('login')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e50914',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#e50914',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
