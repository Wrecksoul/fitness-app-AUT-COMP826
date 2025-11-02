import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthViewModel } from '../viewmodels/AuthViewModel';
import { useServerConfigViewModel } from '../viewmodels/ServerConfigViewModel';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const {
    email, setEmail,
    password, setPassword,
    loading, error,
    login,
    currentUser,
    initializing
  } = useAuthViewModel();
  const {
    serverIp,
    loading: serverConfigLoading,
    error: serverConfigError,
    updateServerIp
  } = useServerConfigViewModel();

  const [ipInput, setIpInput] = useState(serverIp);
  const [ipStatus, setIpStatus] = useState<string | null>(null);
  const [showServerConfig, setShowServerConfig] = useState(false);

  useEffect(() => {
    setIpInput(serverIp);
  }, [serverIp]);

  useEffect(() => {
    if (!initializing && currentUser) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }]
      });
    }
  }, [currentUser, initializing, navigation]);

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

  const handleSaveServerIp = async () => {
    setIpStatus(null);
    const success = await updateServerIp(ipInput.trim());
    setIpStatus(success ? 'Server address saved' : null);
  };

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <TouchableOpacity
        style={styles.serverToggle}
        onPress={() => setShowServerConfig((prev) => !prev)}
      >
        <Text style={styles.serverToggleText}>
          {showServerConfig ? 'Hide Server Settings ▲' : 'Edit Server Address ▼'}
        </Text>
      </TouchableOpacity>

      {showServerConfig && (
        <View style={styles.serverSection}>
          <Text style={styles.sectionLabel}>Server Address</Text>
          <View style={styles.serverRow}>
            <TextInput
              placeholder="Enter server IP"
              style={[styles.input, styles.serverInput]}
              autoCapitalize="none"
              keyboardType="decimal-pad"
              value={ipInput}
              onChangeText={(value) => {
                setIpInput(value);
                setIpStatus(null);
              }}
            />
            <Button title="Apply" onPress={handleSaveServerIp} disabled={serverConfigLoading} />
          </View>
          {serverConfigError && <Text style={styles.error}>{serverConfigError}</Text>}
          {ipStatus && <Text style={styles.success}>{ipStatus}</Text>}
        </View>
      )}

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

      {(loading || serverConfigLoading) ? (
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: {
    width: 200,
    height: 200,
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  sectionLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  serverToggle: { marginBottom: 16, alignItems: 'center' },
  serverToggleText: { color: '#1E90FF', fontWeight: '600' },
  serverSection: { marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginVertical: 8, borderRadius: 4 },
  serverRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  serverInput: { flex: 1, marginRight: 12, marginVertical: 0 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  success: { color: 'green', marginBottom: 10, textAlign: 'center' },
  link: { color: 'blue', marginTop: 20, textAlign: 'center' }
});
