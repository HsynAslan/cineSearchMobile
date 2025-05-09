import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import API_BASE_URL from '../utils/config';
const RegisterScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://${API_BASE_URL}/api/register', {
        name,
        email,
        password,
      });

      if (response.data.success) {
        Alert.alert(t('success'), t('registration_success'));
        navigation.navigate('Login');
      } else {
        Alert.alert(t('error'), response.data.message || t('registration_failed'));
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t('error'), t('something_went_wrong'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('register')}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('name')}
        placeholderTextColor="#aaa"
        onChangeText={setName}
      />
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>{t('register')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

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
