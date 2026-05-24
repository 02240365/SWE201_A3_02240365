import { Platform } from 'react-native';
import type { TaskStatus } from '../types';

/**
 * Central application configuration.
 *
 * IMPORTANT — set API_BASE_URL to match where your backend is reachable:
 *  - Physical phone (Expo Go):  use your computer's LAN IP, e.g. http://192.168.1.100:3001
 *  - Android emulator:          http://10.0.2.2:3001  (special alias for the host machine)
 *  - iOS simulator:             http://localhost:3001
 *
 * Keeping this in one place means we never hard-code URLs across the app.
 */

// 1) Put your computer's LAN IP here (run `ipconfig` / `ifconfig` to find it).
const LAN_IP = '172.20.10.2';
const PORT = 3001;

// 2) Pick a sensible default per platform so emulators/simulators just work.
function resolveBaseUrl(): string {
  if (Platform.OS === 'android') {
    // Android emulator maps the host machine to 10.0.2.2.
    // For a PHYSICAL Android phone, change this to `http://${LAN_IP}:${PORT}`.
    return `http://10.0.2.2:${PORT}`;
  }
  if (Platform.OS === 'ios') {
    // iOS simulator can reach the host via localhost.
    // For a PHYSICAL iPhone, change this to `http://${LAN_IP}:${PORT}`.
    return `http://localhost:${PORT}`;
  }
  return `http://localhost:${PORT}`;
}

// export const API_BASE_URL: string = resolveBaseUrl();

// Manual override for a physical device — uncomment and use your machine's IP:
export const API_BASE_URL = `http://${LAN_IP}:${PORT}`;

/** Network request timeout in milliseconds. */
export const REQUEST_TIMEOUT = 10000;

/** AsyncStorage keys (central to avoid typos). */
export const STORAGE_KEYS = {
  AUTH: '@taskmanager:auth',
  LAST_FILTER: '@taskmanager:lastFilter',
} as const;

/** Allowed task statuses used across the app. */
export const TASK_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done'];
