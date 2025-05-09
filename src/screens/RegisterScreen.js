import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import Video from 'react-native-video';
import DateTimePicker from '@react-native-community/datetimepicker';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    birthday: '',
    gender: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      const formatted = date.toISOString().split('T')[0];
      setSelectedDate(date);
      setForm({ ...form, birthday: formatted });
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('https://cinesearch-backend-1h9k.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Başarılı', data.message);
        navigation.navigate('Login');
      } else {
        Alert.alert('Hata', data.message || 'Kayıt başarısız.');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      Alert.alert('Sunucu hatası.');
    }
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../assets/videos/background.mp4')}
        style={StyleSheet.absoluteFill}
        muted
        repeat
        resizeMode="cover"
        rate={1.0}
        ignoreSilentSwitch="obey"
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Kayıt Ol</Text>

        <TextInput
          placeholder="Ad"
          style={styles.input}
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />
        <TextInput
          placeholder="Soyad"
          style={styles.input}
          value={form.surname}
          onChangeText={(text) => setForm({ ...form, surname: text })}
        />
        <TextInput
          placeholder="E-posta"
          style={styles.input}
          keyboardType="email-address"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
        />
        <TextInput
          placeholder="Şifre"
          style={styles.input}
          secureTextEntry
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
        />

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={[styles.input, styles.dateButton]}
        >
          <Text style={{ color: form.birthday ? '#000' : '#999' }}>
            {form.birthday || 'Doğum Tarihi Seçin'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

       <View style={styles.pickerWrapper}>
  <Picker
    selectedValue={form.gender}
    onValueChange={(itemValue) => setForm({ ...form, gender: itemValue })}
    style={styles.picker}
  >
    <Picker.Item label="Erkek" value="male" />
    <Picker.Item label="Kadın" value="female" />
    <Picker.Item label="Diğer" value="other" />
  </Picker>
</View>



        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Üye Ol</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Zaten hesabınız var mı? Giriş Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 100,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  pickerWrapper: {
  backgroundColor: '#fff',
  borderRadius: 10,
  marginBottom: 12,
  overflow: 'hidden',
},
picker: {
  height: 50,
  width: '100%',
},

  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  dateButton: {
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  link: {
    marginTop: 16,
    color: '#fff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
