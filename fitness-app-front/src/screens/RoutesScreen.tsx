// src/screens/RoutesScreen.tsx

import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRoutesViewModel } from "../viewmodels/RoutesViewModel";
import RouteCard from "../components/RouteCard";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from "../navigation/AppNavigator";

const RoutesScreen: React.FC = () => {
  const { routes } = useRoutesViewModel();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Routes</Text>
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
});

export default RoutesScreen;