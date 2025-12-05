import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig'; // Import config yang kita buat

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mahasiswaData, setMahasiswaData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cek Login saat aplikasi dibuka (Kombinasi LocalStorage + Firebase)
  // Referensi PDF Hal 15: Cek token/user di storage saat app dibuka [cite: 138, 146]
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('userData');
      if (savedUser) {
        // Jika ada data user tersimpan, set state user
        setUser(JSON.parse(savedUser));
        fetchMahasiswa(); // Langsung ambil data mahasiswa
      }
    } catch (e) {
      console.error("Gagal membaca storage:", e);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Login (Tugas Poin 1)
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password harus diisi");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = {
        email: userCredential.user.email,
        uid: userCredential.user.uid
      };
      
      // SIMPAN DATA LOGIN KE ASYNCSTORAGE (PERSISTENT)
      // Referensi PDF Hal 7: Data tetap tersimpan meski app ditutup [cite: 50, 53]
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      setUser(userData);
      fetchMahasiswa(); // Ambil data setelah login berhasil
      
    } catch (error) {
      Alert.alert("Login Gagal", error.message);
    }
  };

  // Fungsi Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('userData'); // Hapus sesi dari storage
      setUser(null);
      setMahasiswaData([]);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Fungsi Fetch Data Mahasiswa (Tugas Poin 3)
  // Referensi PDF Hal 12: Mengambil data menggunakan get() [cite: 102]
  const fetchMahasiswa = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "mahasiswa"));
      const dataList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMahasiswaData(dataList);
    } catch (error) {
      console.error("Gagal ambil data:", error);
      Alert.alert("Error", "Gagal mengambil data mahasiswa");
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  // TAMPILAN LOGIN
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login Mahasiswa</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Masuk" onPress={handleLogin} />
      </View>
    );
  }

  // TAMPILAN DATA (Jika sudah login)
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Halo, {user.email}</Text>
      
      <Text style={styles.subtitle}>Data Mahasiswa (Dari Firestore):</Text>
      
      <FlatList
        data={mahasiswaData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nama}</Text>
            <Text>NIM: {item.nim}</Text>
            <Text>Jurusan: {item.jurusan}</Text>
          </View>
        )}
      />

      <Button title="Keluar (Logout)" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 15 },
  welcome: { fontSize: 16, marginBottom: 10, color: 'blue' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5, backgroundColor: 'white' },
  card: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 }
});