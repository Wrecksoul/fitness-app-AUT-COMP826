import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Button, Modal, Image, Alert } from "react-native";
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
  const [showReward, setShowReward] = useState(false);
  const [showMedal, setShowMedal] = useState(false);

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

      // Show reward animation
      setShowReward(true);
      setTimeout(() => setShowReward(false), 1500);

      // If last checkpoint, show medal after reward
      if (nextIndex === checkpoints.length - 1) {
        setTimeout(() => setShowMedal(true), 1800);
      }
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
      {showReward && (
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardText}>🎉 Check-in Success! +10 Coins</Text>
        </View>
      )}
      {showMedal && (
        <Modal transparent animationType="fade" visible={showMedal}>
          <View style={styles.medalOverlay}>
            <View style={styles.medalBox}>
              <Text style={styles.medalText}>🏅 Congratulations!</Text>
              <Text>You’ve completed the route!</Text>
              <Button title="OK" onPress={() => setShowMedal(false)} />
            </View>
          </View>
        </Modal>
      )}
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
  rewardContainer: {
    position: "absolute",
    top: "40%",
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 4,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "goldenrod",
  },
  medalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  medalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  medalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default MapScreen;
