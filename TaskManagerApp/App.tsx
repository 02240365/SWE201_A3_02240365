import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import {
  AppProvider,
  useAppDispatch,
  useHydrated,
  useAuthState,
} from './src/state/store';
import { loadPersistedState } from './src/state/persistence';
import { setAuthToken } from './src/api/client';
import { useAuth } from './src/hooks/useAuth';
import { Loading } from './src/components/StateViews';
import Icon from './src/components/Icon';
import { theme } from './src/utils/theme';
import type { RootStackParamList } from './src/navigation/types';

import LoginScreen from './src/screens/LoginScreen';
import TaskListScreen from './src/screens/TaskListScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import TaskFormScreen from './src/screens/TaskFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Logout icon button rendered in the list screen header. */
function LogoutButton() {
  const { logout } = useAuth();
  return (
    <TouchableOpacity onPress={logout} hitSlop={10}>
      <Icon name="log-out-outline" size={22} color="#ffffff" />
    </TouchableOpacity>
  );
}

const screenOptions = {
  headerStyle: { backgroundColor: theme.colors.primary },
  headerTintColor: '#ffffff',
  headerTitleStyle: { fontWeight: '700' as const },
};

/**
 * Decides which stack to show based on auth state.
 * Waits for persisted state to rehydrate before rendering anything, so a
 * logged-in user isn't briefly shown the login screen.
 */
function RootNavigator() {
  const dispatch = useAppDispatch();
  const hydrated = useHydrated();
  const auth = useAuthState();
  const [bootstrapping, setBootstrapping] = useState(true);

  // On app start: load persisted auth/filter, inject token, then mark hydrated.
  useEffect(() => {
    (async () => {
      const persisted = await loadPersistedState();
      if (persisted.auth && persisted.auth.token) {
        setAuthToken(persisted.auth.token);
      }
      dispatch({ type: 'HYDRATE', payload: persisted });
      setBootstrapping(false);
    })();
  }, [dispatch]);

  if (bootstrapping || !hydrated) {
    return <Loading message="Starting up..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {auth ? (
          <>
            <Stack.Screen
              name="TaskList"
              component={TaskListScreen}
              options={{ title: 'My Tasks', headerRight: () => <LogoutButton /> }}
            />
            <Stack.Screen
              name="TaskDetail"
              component={TaskDetailScreen}
              options={{ title: 'Task Details' }}
            />
            <Stack.Screen
              name="TaskForm"
              component={TaskFormScreen}
              options={({ route }: { route: { params: RootStackParamList['TaskForm'] } }) => ({
                title: route.params.mode === 'edit' ? 'Edit Task' : 'New Task',
              })}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/** App root: wraps everything in providers. */
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <StatusBar style="light" />
          <RootNavigator />
        </View>
      </AppProvider>
    </SafeAreaProvider>
  );
}
