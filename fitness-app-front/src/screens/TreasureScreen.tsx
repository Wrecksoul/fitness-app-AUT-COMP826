// src/screens/TreasureScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const mockTreasures = [
  { id: 't1', name: '🏅 Gold Badge', earned: true },
  { id: 't2', name: '🥈 Silver Explorer', earned: false },
];

const TreasureScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>💎 Treasure Room</Text>
      <FlatList
        data={mockTreasures}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, item.earned ? styles.earned : styles.locked]}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>{item.earned ? 'Unlocked' : 'Locked'}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  item: { padding: 12, borderRadius: 8, marginBottom: 12 },
  earned: { backgroundColor: '#d4edda' },
  locked: { backgroundColor: '#f8d7da' },
  name: { fontSize: 18 },
});

export default TreasureScreen;