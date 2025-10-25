import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";

type MapScreenRouteProp = RouteProp<RootStackParamList, "Map">;

type Checkpoint = {
  id: string;
  latitude: number;
  longitude: number;
  visited: boolean;
};

const initialCheckpoints: Checkpoint[] = [
  { id: "cp1", latitude: -36.8485, longitude: 174.7633, visited: false },
  { id: "cp2", latitude: -36.8495, longitude: 174.7645, visited: false },
  { id: "cp3", latitude: -36.8505, longitude: 174.7665, visited: false },
];

const MapScreen = () => {
  const route = useRoute<MapScreenRouteProp>();
  const { routeId } = route.params ?? { routeId: "unknown" };

  const [checkpoints, setCheckpoints] =
    useState<Checkpoint[]>(initialCheckpoints);

  const mapRef = useRef<MapView>(null);

  const allCheckedIn = checkpoints.every((cp) => cp.visited);

  const handleNextCheckIn = () => {
    const nextIndex = checkpoints.findIndex((cp) => !cp.visited);
    if (nextIndex !== -1) {
      const updated = [...checkpoints];
      console.log("✅ Updating checkpoint0:", updated[nextIndex]);
      updated[nextIndex].visited = true;
      console.log("✅ Updating checkpoint1:", updated[nextIndex]);
      setCheckpoints(updated);

      // 使用 requestAnimationFrame 保证平滑
      requestAnimationFrame(() => {
        const target = updated[nextIndex];
        mapRef.current?.animateCamera(
          {
            center: {
              latitude: target.latitude,
              longitude: target.longitude,
            },
            zoom: 16,
          },
          { duration: 800 }
        );
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: initialCheckpoints[0].latitude,
          longitude: initialCheckpoints[0].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* 路线连接 */}
        <Polyline
          coordinates={checkpoints.map((cp) => ({
            latitude: cp.latitude,
            longitude: cp.longitude,
          }))}
          strokeColor="#1E90FF"
          strokeWidth={4}
        />

        {/* Checkpoints */}
        {checkpoints.map((cp) => {
          console.log(`📍 Rendering Marker ${cp.id} - visited: ${cp.visited}`);
          return (
            <Marker
              key={`${cp.id}-${cp.visited}`} // 👈 每次 visited 改变都会触发 Marker 重建
              coordinate={{ latitude: cp.latitude, longitude: cp.longitude }}
              pinColor={cp.visited ? "green" : "red"}
            />
          );
        })}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.routeId}>Current Route: {routeId}</Text>
        <Text style={styles.progress}>
          Progress: {checkpoints.filter((cp) => cp.visited).length}/
          {checkpoints.length}
        </Text>
        <Button
          title={
            allCheckedIn ? "🎉 All Checkpoints Completed" : "Check In Next"
          }
          onPress={handleNextCheckIn}
          disabled={allCheckedIn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  footer: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
  },
  routeId: {
    fontSize: 14,
    marginBottom: 4,
  },
  progress: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default MapScreen;
