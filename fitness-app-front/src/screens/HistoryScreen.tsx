// src/screens/HistoryScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const mockHistory = [
  { id: 'r1', name: 'Route One', date: '2025-10-01' },
  { id: 'r2', name: 'Route Two', date: '2025-10-10' },
];

const HistoryScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗺️ Route History</Text>
      <FlatList
        data={mockHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.route}>{item.name}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  item: { marginBottom: 12, padding: 12, backgroundColor: '#eee', borderRadius: 8 },
  route: { fontSize: 18 },
  date: { fontSize: 14, color: 'gray' },
});

export default HistoryScreen;