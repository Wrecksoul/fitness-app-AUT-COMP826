import React from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthViewModel } from '../viewmodels/AuthViewModel';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const {
    email, setEmail,
    password, setPassword,
    loading, error,
    login
  } = useAuthViewModel();

  const handleLogin = () => {
    login(
      (user) => {
        console.log('Login success:', user);
        navigation.navigate('Dashboard');
      },
      () => {
        console.log('Login failed');
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}

      <Text
        style={styles.link}
        onPress={() => navigation.navigate('SignUp')}
      >
        Don’t have an account? Sign up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: {
    width: 200,
    height: 200,
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginVertical: 8, borderRadius: 4 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  link: { color: 'blue', marginTop: 20, textAlign: 'center' }
});