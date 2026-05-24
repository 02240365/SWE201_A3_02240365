import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config';
import type { AppState } from './store';
import type { AuthData, Filter } from '../types';

/**
 * Thin wrapper around AsyncStorage for the slices we persist:
 *  - auth token + user
 *  - last selected list filter
 *
 * All functions are defensive: a storage failure should never crash the app.
 */

export async function saveAuth(auth: AuthData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(auth));
  } catch (e) {
    console.warn('Failed to persist auth', e);
  }
}

export async function clearAuth(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH);
  } catch (e) {
    console.warn('Failed to clear auth', e);
  }
}

export async function saveFilter(filter: Filter): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_FILTER, JSON.stringify(filter));
  } catch (e) {
    console.warn('Failed to persist filter', e);
  }
}

/**
 * Read all persisted slices at once.
 * Returns an object suitable for the HYDRATE action payload.
 */
export async function loadPersistedState(): Promise<Partial<AppState>> {
  const result: Partial<AppState> = {};
  try {
    const authRaw = await AsyncStorage.getItem(STORAGE_KEYS.AUTH);
    if (authRaw) result.auth = JSON.parse(authRaw) as AuthData;

    const filterRaw = await AsyncStorage.getItem(STORAGE_KEYS.LAST_FILTER);
    if (filterRaw) result.filter = JSON.parse(filterRaw) as Filter;
  } catch (e) {
    console.warn('Failed to load persisted state', e);
  }
  return result;
}
