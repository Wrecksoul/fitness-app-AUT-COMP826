import React from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthViewModel } from '../viewmodels/AuthViewModel';

export default function SignUpScreen() {
  const navigation = useNavigation<any>();
  const {
    email, setEmail,
    password, setPassword,
    displayName, setDisplayName,
    loading, error,
    signup
  } = useAuthViewModel();

  const handleSignUp = () => {
    signup(
      (user) => {
        console.log('Sign up success:', user);
        navigation.navigate('Dashboard');
      },
      () => {
        console.log('Sign up failed');
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Display Name"
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
      />

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
        <Button title="Sign Up" onPress={handleSignUp} />
      )}

      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Log in
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginVertical: 8, borderRadius: 4 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  link: { color: 'blue', marginTop: 20, textAlign: 'center' }
});