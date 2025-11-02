// src/screens/RoutesScreen.tsx

import React, { useEffect, useRef } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { useRoutesViewModel } from "../viewmodels/RoutesViewModel";
import RouteCard from "../components/RouteCard";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuthViewModel } from "../viewmodels/AuthViewModel";

const RoutesScreen: React.FC = () => {
  const { routes, loading, error, unauthorized, refresh } = useRoutesViewModel();
  const { logout } = useAuthViewModel();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handledRef = useRef(false);

  useEffect(() => {
    if (unauthorized && !handledRef.current) {
      handledRef.current = true;
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
      handledRef.current = false;
    }
  }, [unauthorized, logout, navigation]);

  if (loading && routes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Routes</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RouteCard
            route={item}
            onStart={() =>
              navigation.navigate("Map", { routeId: item.id })
            }
          />
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        ListEmptyComponent={!loading ? <Text style={styles.emptyText}>No routes found.</Text> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    paddingTop: 32,
    color: '#666',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

export default RoutesScreen;
