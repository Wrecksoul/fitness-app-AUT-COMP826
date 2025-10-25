import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";

type MapScreenRouteProp = RouteProp<RootStackParamList, "Map">;

const MapScreen: React.FC = () => {
  const route = useRoute<MapScreenRouteProp>();
  const { routeId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Map Screen</Text>
      <Text>Received Route ID: {routeId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default MapScreen;