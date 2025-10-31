import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import MapScreen from '../screens/MapScreen';
import RoutesScreen from "../screens/RoutesScreen";
import ProfileScreen from '../screens/ProfileScreen';
import HistoryScreen from '../screens/HistoryScreen';
import TreasureScreen from '../screens/TreasureScreen';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  Routes: undefined;
  Map: { routeId: string };
  Profile: undefined;
  History: undefined;
  Treasure: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Routes" component={RoutesScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Treasure" component={TreasureScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}