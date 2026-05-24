import React, { ReactNode } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Button from './Button';
import Icon from './Icon';
import { theme } from '../utils/theme';

/** Full-screen loading spinner with an optional message. */
export function Loading({ message = 'Loading...' }: { message?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.muted}>{message}</Text>
    </View>
  );
}

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

/** Error message with a Retry button (satisfies the retry-mechanism requirement). */
export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.center}>
      <Icon name="cloud-offline-outline" size={48} color={theme.colors.danger} />
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.muted}>{message}</Text>
      {onRetry ? (
        <Button
          title="Retry"
          icon="refresh"
          onPress={onRetry}
          style={{ marginTop: 16, paddingHorizontal: 32 }}
        />
      ) : null}
    </View>
  );
}

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
}

/** Friendly empty-data view. */
export function EmptyState({
  title = 'Nothing here yet',
  subtitle,
  icon = 'file-tray-outline',
  action,
}: EmptyStateProps) {
  return (
    <View style={styles.center}>
      <Icon name={icon} size={48} color={theme.colors.textMuted} />
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.muted}>{subtitle}</Text> : null}
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  muted: { marginTop: 8, color: theme.colors.textMuted, textAlign: 'center', fontSize: 15 },
  errorTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.danger, marginTop: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginTop: 12, marginBottom: 4 },
});
