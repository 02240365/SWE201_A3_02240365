import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { useForm } from '../hooks/useForm';
import { useAuth } from '../hooks/useAuth';
import { validateAuth } from '../utils/validation';
import { theme } from '../utils/theme';
import type { Credentials } from '../types';

type Mode = 'signin' | 'signup';

/**
 * Combined Sign In / Sign Up screen.
 * Toggling the mode switches which auth action runs on submit.
 */
export default function LoginScreen() {
  const [mode, setMode] = useState<Mode>('signin');
  const { login, signup, loading, error } = useAuth();

  const form = useForm<Credentials>({ email: '', password: '' }, validateAuth);

  const onSubmit = async () => {
    if (!form.validateAll()) return;
    const action = mode === 'signin' ? login : signup;
    await action(form.values);
    // On success the root navigator swaps to the app stack automatically,
    // because isAuthenticated becomes true in global state.
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoCircle}>
          <Icon name="checkbox" size={36} color="#ffffff" />
        </View>
        <Text style={styles.brand}>Task Manager</Text>
        <Text style={styles.subtitle}>
          {mode === 'signin' ? 'Sign in to continue' : 'Create a new account'}
        </Text>

        <InputField
          label="Email"
          icon="mail-outline"
          value={form.values.email}
          onChangeText={(t) => form.handleChange('email', t)}
          onBlur={() => form.handleBlur('email')}
          error={form.errors.email}
          touched={form.touched.email}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          label="Password"
          icon="lock-closed-outline"
          value={form.values.password}
          onChangeText={(t) => form.handleChange('password', t)}
          onBlur={() => form.handleBlur('password')}
          error={form.errors.password}
          touched={form.touched.password}
          placeholder="••••••"
          secureTextEntry
          autoCapitalize="none"
        />

        {error ? (
          <View style={styles.apiErrorRow}>
            <Icon name="alert-circle" size={16} color={theme.colors.danger} />
            <Text style={styles.apiError}>{error}</Text>
          </View>
        ) : null}

        <Button
          title={mode === 'signin' ? 'Sign In' : 'Sign Up'}
          icon={mode === 'signin' ? 'log-in-outline' : 'person-add-outline'}
          onPress={onSubmit}
          loading={loading}
          style={{ marginTop: 8 }}
        />

        <Button
          title={
            mode === 'signin'
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'
          }
          variant="secondary"
          onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          style={{ marginTop: 12 }}
        />

        <Text style={styles.hint}>Demo: any valid email + password (4+ chars) works.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoCircle: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brand: { fontSize: 28, fontWeight: '800', color: theme.colors.text, textAlign: 'center' },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 28,
    marginTop: 4,
  },
  apiErrorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8, justifyContent: 'center' },
  apiError: { color: theme.colors.danger, textAlign: 'center' },
  hint: { marginTop: 20, color: theme.colors.textMuted, textAlign: 'center', fontSize: 13 },
});
