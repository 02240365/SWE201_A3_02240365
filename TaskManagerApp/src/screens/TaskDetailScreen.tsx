import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { EmptyState } from '../components/StateViews';
import { useAppDispatch, useTaskById, useCategories } from '../state/store';
import { deleteTask } from '../api/tasks';
import { theme } from '../utils/theme';
import type { TaskDetailProps } from '../navigation/types';
import type { ApiError } from '../types';

/**
 * Detail view for a single task.
 * Reads the task from global state (selector) and offers Edit + Delete.
 * Delete asks for confirmation, calls the API, then updates global state.
 */
export default function TaskDetailScreen({ route, navigation }: TaskDetailProps) {
  const { id } = route.params;
  const task = useTaskById(id);
  const categories = useCategories();
  const dispatch = useAppDispatch();
  const [deleting, setDeleting] = useState(false);

  if (!task) {
    return (
      <EmptyState
        icon="help-circle-outline"
        title="Task not found"
        subtitle="It may have been deleted."
        action={
          <Button title="Go Back" icon="arrow-back" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
        }
      />
    );
  }

  const category = categories.find((c) => String(c.id) === String(task.categoryId));

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(task.id);
      dispatch({ type: 'REMOVE_TASK', payload: task.id });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Delete failed', (e as ApiError).message || 'Could not delete the task.');
    } finally {
      setDeleting(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert('Delete task', `Are you sure you want to delete "${task.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: handleDelete },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{task.title}</Text>
      <StatusBadge status={task.status} />

      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Icon name="pricetag-outline" size={15} color={theme.colors.textMuted} />
          <Text style={styles.label}>Category</Text>
        </View>
        <Text style={styles.value}>{category ? category.name : 'Uncategorized'}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.labelRow}>
          <Icon name="document-text-outline" size={15} color={theme.colors.textMuted} />
          <Text style={styles.label}>Description</Text>
        </View>
        <Text style={styles.value}>
          {task.description ? task.description : 'No description provided.'}
        </Text>
      </View>

      {task.createdAt ? (
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Icon name="calendar-outline" size={15} color={theme.colors.textMuted} />
            <Text style={styles.label}>Created</Text>
          </View>
          <Text style={styles.value}>{new Date(task.createdAt).toLocaleString()}</Text>
        </View>
      ) : null}

      <Button
        title="Edit Task"
        icon="create-outline"
        onPress={() => navigation.navigate('TaskForm', { mode: 'edit', id: task.id })}
        style={{ marginTop: 24 }}
      />
      <Button
        title="Delete Task"
        icon="trash-outline"
        variant="danger"
        loading={deleting}
        onPress={confirmDelete}
        style={{ marginTop: 12 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: '800', color: theme.colors.text, marginBottom: 12 },
  section: { marginTop: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: { fontSize: 16, color: theme.colors.text, marginTop: 4, lineHeight: 22 },
});
