import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_IP_STORAGE_KEY = 'server_ip';
const DEFAULT_IP = '192.168.216.72';
const DEFAULT_PORT = '8080';

let currentIp = DEFAULT_IP;

export function getServerIp() {
  return currentIp;
}

export function getBaseUrl() {
  return `http://${currentIp}:${DEFAULT_PORT}`;
}

export async function initializeServerConfig() {
  try {
    const storedIp = await AsyncStorage.getItem(SERVER_IP_STORAGE_KEY);
    if (storedIp && isValidIp(storedIp)) {
      currentIp = storedIp;
    }
  } catch (error) {
    console.error('Failed to load server IP', error);
  }

  return currentIp;
}

export async function setServerIp(ip: string) {
  if (!isValidIp(ip)) {
    throw new Error('Invalid IP address');
  }

  currentIp = ip;
  try {
    await AsyncStorage.setItem(SERVER_IP_STORAGE_KEY, ip);
  } catch (error) {
    console.error('Failed to persist server IP', error);
  }
}

export function isValidIp(ip: string) {
  const trimmed = ip.trim();
  const ipv4Regex =
    /^(25[0-5]|2[0-4]\d|1?\d{1,2})(\.(25[0-5]|2[0-4]\d|1?\d{1,2})){3}$/;
  return ipv4Regex.test(trimmed);
}

export async function clearServerIp() {
  currentIp = DEFAULT_IP;
  try {
    await AsyncStorage.removeItem(SERVER_IP_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear server IP', error);
  }
}
