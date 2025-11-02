// src/screens/HistoryScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthViewModel } from '../viewmodels/AuthViewModel';
import { useHistoryViewModel, HistoryEntry } from '../viewmodels/HistoryViewModel';

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { currentUser, logout } = useAuthViewModel();
  const { entries, loading, error, unauthorized, refresh } = useHistoryViewModel(currentUser?.email ?? null);
  const unauthorizedHandledRef = useRef(false);

  useEffect(() => {
    if (unauthorized && !unauthorizedHandledRef.current) {
      unauthorizedHandledRef.current = true;
      Alert.alert('Session expired', 'Please log in again.', [
        {
          text: 'OK',
          onPress: () => {
            logout().finally(() => {
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            });
          }
        }
      ]);
    } else if (!unauthorized) {
      unauthorizedHandledRef.current = false;
    }
  }, [unauthorized, logout, navigation]);

  const renderItem = ({ item }: { item: HistoryEntry }) => {
    const duration = formatDuration(item.startedAt, item.completedAt);
    return (
      <View style={styles.item}>
        <Text style={styles.route}>{item.routeName}</Text>
        <Text style={styles.date}>
          {formatDate(item.startedAt)} → {formatDate(item.completedAt)}
        </Text>
        <Text style={styles.meta}>{item.checkpoints.length} checkpoints • {duration}</Text>
      </View>
    );
  };

  if (loading && entries.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗺️ Route History</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.empty}>No history yet. Start a route to see your progress!</Text>
          ) : null
        }
        contentContainerStyle={entries.length === 0 ? styles.emptyContainer : undefined}
      />
    </View>
  );
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleString();
}

function formatDuration(start: string, end: string) {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
    return '';
  }

  const diffMs = Math.max(0, endTime - startTime);
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  if (diffMinutes === 0) {
    return '<1 min';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  }

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  error: { color: 'red', marginBottom: 8 },
  item: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  route: { fontSize: 18, fontWeight: '600' },
  date: { fontSize: 14, color: '#555', marginTop: 4 },
  meta: { fontSize: 12, color: '#777', marginTop: 4 },
  empty: { textAlign: 'center', color: '#666', marginTop: 32 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' },
});

export default HistoryScreen;
