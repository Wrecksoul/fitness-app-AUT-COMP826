// src/components/RouteCard.tsx

import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Route } from "../models/Route";

type Props = {
  route: Route;
  onStart: () => void;
};

const RouteCard: React.FC<Props> = ({ route, onStart }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{route.name}</Text>
      <Text>{route.description}</Text>
      <Text style={styles.distance}>{route.distanceKm} km</Text>
      <Button title="Start Challenge" onPress={onStart} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  distance: {
    marginTop: 4,
    marginBottom: 8,
    color: "#555",
  },
});

export default RouteCard;