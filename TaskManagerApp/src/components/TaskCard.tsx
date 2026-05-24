import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import StatusBadge from './StatusBadge';
import Icon from './Icon';
import { theme } from '../utils/theme';
import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  categoryName?: string;
  onPress: () => void;
}

/** A single task row in the list. Tapping it opens the detail screen. */
export default function TaskCard({ task, categoryName, onPress }: TaskCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {task.title}
          </Text>
          <StatusBadge status={task.status} />
        </View>

        {task.description ? (
          <Text style={styles.desc} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        <View style={styles.footer}>
          <Icon name="pricetag-outline" size={13} color={theme.colors.primary} />
          <Text style={styles.category}>{categoryName || 'Uncategorized'}</Text>
        </View>
      </View>
      <Icon name="chevron-forward" size={20} color={theme.colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  body: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { flex: 1, fontSize: 16, fontWeight: '700', color: theme.colors.text, marginRight: 8 },
  desc: { marginTop: 6, color: theme.colors.textMuted, fontSize: 14 },
  footer: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 4 },
  category: { fontSize: 13, color: theme.colors.primary, fontWeight: '600' },
});
