// src/screens/DashboardScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import backgroundImg from "../../assets/background.png";

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ImageBackground source={backgroundImg} style={styles.background}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate("Routes" as never)}>
          <Text style={styles.buttonText}>Find Routes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate("History" as never)}>
          <Text style={styles.buttonText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate("Treasure" as never)}>
          <Text style={styles.buttonText}>Treasure</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bigButton} onPress={() => navigation.navigate("Profile" as never)}>
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    width: '80%',
  },
  bigButton: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
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
});

export default DashboardScreen;