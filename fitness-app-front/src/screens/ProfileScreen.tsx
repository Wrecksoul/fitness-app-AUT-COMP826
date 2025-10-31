// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const ProfileScreen: React.FC = () => {
  const handleChangePassword = () => {
    // TODO: navigate to change password screen or open modal
    alert("Change password feature coming soon");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profile</Text>
      <Text style={styles.label}>Username: alice</Text>
      <Button title="Change Password" onPress={handleChangePassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 18, marginBottom: 12 },
});

export default ProfileScreen;