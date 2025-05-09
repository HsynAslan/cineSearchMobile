import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return navigation.replace('Login');

      const res = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (err) {
      Alert.alert('Hata', 'Profil bilgileri alınamadı.');
      navigation.replace('Login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Profil bilgisi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👤 Profil</Text>
      <View style={styles.infoBox}>
        <Text style={styles.item}><Text style={styles.label}>Ad:</Text> {user.name}</Text>
        <Text style={styles.item}><Text style={styles.label}>Soyad:</Text> {user.surname}</Text>
        <Text style={styles.item}><Text style={styles.label}>E-posta:</Text> {user.email}</Text>
        <Text style={styles.item}><Text style={styles.label}>Doğum Tarihi:</Text> {user.birthday}</Text>
        <Text style={styles.item}><Text style={styles.label}>Cinsiyet:</Text> {user.gender}</Text>
        <Text style={styles.item}><Text style={styles.label}>Durum:</Text> {user.isVerified ? '✅ Doğrulandı' : '❌ Doğrulanmadı'}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f7fc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  item: {
    fontSize: 16,
    marginBottom: 12,
    color: '#444',
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  logoutBtn: {
    marginTop: 30,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfileScreen;
