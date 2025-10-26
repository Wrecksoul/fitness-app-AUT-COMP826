// src/screens/DashboardScreen.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import MapView from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Map background */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: -36.8485,
          longitude: 174.7633,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      />

      {/* Search button (fake input style) */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate("Routes" as never)}
      >
        <Text style={styles.searchText}>🔍 Tap to Find Nearby Routes</Text>
      </TouchableOpacity>

      {/* Bottom menu */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>👤</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>🕘</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>≡</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 80 : 60,
    left: 20,
    right: 20,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 5,
    alignItems: "center",
  },
  searchText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  bottomMenu: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
  menuButton: {
    padding: 8,
  },
  menuText: {
    fontSize: 24,
  },
});

export default DashboardScreen;