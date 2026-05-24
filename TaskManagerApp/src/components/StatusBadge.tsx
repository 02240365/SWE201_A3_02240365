import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import { statusMeta } from '../utils/theme';
import type { TaskStatus } from '../types';

/** Small colored pill (icon + label) showing a task's status. */
export default function StatusBadge({ status }: { status: TaskStatus }) {
  const meta = statusMeta(status);
  return (
    <View style={[styles.badge, { backgroundColor: meta.color + '1A', borderColor: meta.color }]}>
      <Icon name={meta.icon} size={13} color={meta.color} />
      <Text style={[styles.text, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  text: { fontSize: 12, fontWeight: '700' },
});
