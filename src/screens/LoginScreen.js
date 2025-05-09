import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    setError('');
    setMessage('');

    try {
      const res = await axios.post('https://cinesearch-backend-1h9k.onrender.com/api/auth/login', {
        email,
        password,
      });

      await AsyncStorage.setItem('token', res.data.token);
      setMessage(res.data.message || 'Giriş başarılı!');

      setTimeout(() => navigation.replace('HomePage'), 1000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Giriş yapılamadı.';
      setError(msg);
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/videos/background.mp4')}
        style={styles.backgroundVideo}
        muted
        repeat
        resizeMode="cover"
        rate={1.0}
        ignoreSilentSwitch="obey"
      />

      <View style={styles.overlay}>
        <Text style={styles.header}>Giriş Yap</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {message ? <Text style={styles.success}>{message}</Text> : null}

        <TextInput
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor="#999"
          secureTextEntry
        />

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Hesabınız yok mu? Kayıt Olun</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundVideo: {
    width: width,
    height: height,
    position: 'absolute',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
  error: {
    color: 'salmon',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  success: {
    color: 'lightgreen',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
});
