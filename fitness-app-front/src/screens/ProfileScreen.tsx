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
      <Text style={styles.sectionTitle}>🏃 Fitness Stats</Text>
      <Text style={styles.stat}>🔥 Calories Burned: 5,780 kcal</Text>
      <Text style={styles.stat}>📏 Total Distance: 42.3 km</Text>
      <Text style={styles.stat}>⏱️ Total Time: 6h 30m</Text>
      <Text style={styles.stat}>🗓️ Today: 45 min</Text>
      <Text style={styles.stat}>📆 This Month: 8h 15m</Text>
      <View style={styles.passwordButton}>
        <Button title="Change Password" onPress={handleChangePassword} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 16, paddingTop: 48 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 18, marginBottom: 12 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginTop: 24, marginBottom: 8 },
  stat: { fontSize: 16, lineHeight: 28, marginBottom: 12 },
  passwordButton: { marginTop: 32 }
});

export default ProfileScreen;