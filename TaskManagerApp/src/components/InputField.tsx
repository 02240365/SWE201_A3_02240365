import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';
import Icon from './Icon';
import { theme } from '../utils/theme';

interface InputFieldProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  multiline?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  icon?: string;
}

/**
 * Labeled text input that shows a validation error when the field has been
 * touched and has an error. Supports an optional leading icon.
 */
export default function InputField({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  placeholder,
  multiline = false,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  maxLength,
  icon,
}: InputFieldProps) {
  const showError = !!touched && !!error;
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputRow,
          multiline && styles.multilineRow,
          showError && styles.inputError,
        ]}
      >
        {icon ? (
          <Icon name={icon} size={18} color={theme.colors.textMuted} />
        ) : null}
        <TextInput
          style={[styles.input, multiline && styles.multiline]}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted}
          multiline={multiline}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
        />
      </View>
      {showError ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius,
    paddingHorizontal: 14,
  },
  multilineRow: { alignItems: 'flex-start', paddingVertical: 10 },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: theme.colors.text },
  multiline: { height: 100, textAlignVertical: 'top' },
  inputError: { borderColor: theme.colors.danger },
  error: { color: theme.colors.danger, fontSize: 13, marginTop: 4 },
});
