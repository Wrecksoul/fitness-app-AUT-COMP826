import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import * as Location from "expo-location";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";

type MapScreenRouteProp = RouteProp<RootStackParamList, "Map">;

const MapScreen: React.FC = () => {
  const route = useRoute<MapScreenRouteProp>();
  const { routeId } = route.params;

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const checkpoints = [
    { latitude: -36.8485, longitude: 174.7633 },
    { latitude: -36.8500, longitude: 174.7650 },
    { latitude: -36.8515, longitude: 174.7680 },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);
    })();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Fetching location...</Text>
      </View>
    );
  }

  const region: Region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <MapView style={styles.map} initialRegion={region} showsUserLocation>
      {/* 路线 polyline */}
      <Polyline
        coordinates={checkpoints}
        strokeColor="#1E90FF"
        strokeWidth={4}
      />

      {/* 显示 checkpoint */}
      {checkpoints.map((point, index) => (
        <Marker
          key={index}
          coordinate={point}
          title={`Checkpoint ${index + 1}`}
          pinColor="green"
        />
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MapScreen;