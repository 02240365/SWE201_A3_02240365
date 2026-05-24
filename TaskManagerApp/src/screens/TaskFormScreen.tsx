import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { useForm } from '../hooks/useForm';
import { useAppDispatch, useTaskById, useCategories } from '../state/store';
import { createTask, updateTask } from '../api/tasks';
import { validateTask } from '../utils/validation';
import { theme, statusMeta } from '../utils/theme';
import { TASK_STATUSES } from '../config';
import type { TaskFormProps } from '../navigation/types';
import type { TaskInput, TaskStatus, ApiError } from '../types';

/**
 * Create OR edit a task, depending on route.params.mode.
 * - 'create': empty form, POST on submit.
 * - 'edit':   pre-filled from global state, PATCH on submit.
 * Updates global state immediately on success so the UI reflects changes.
 */
export default function TaskFormScreen({ route, navigation }: TaskFormProps) {
  const params = route.params;
  const isEdit = params.mode === 'edit';
  const editId = params.mode === 'edit' ? params.id : undefined;

  const existing = useTaskById(editId ?? '');
  const categories = useCategories();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  // Seed initial form values from the existing task when editing.
  const form = useForm<TaskInput>(
    {
      title: isEdit && existing ? existing.title : '',
      description: isEdit && existing ? existing.description : '',
      status: isEdit && existing ? existing.status : 'todo',
      categoryId: isEdit && existing ? String(existing.categoryId) : '',
    },
    validateTask
  );

  const onSubmit = async () => {
    if (!form.validateAll()) return;
    setSubmitting(true);
    const payload: TaskInput = {
      title: form.values.title.trim(),
      description: form.values.description.trim(),
      status: form.values.status,
      categoryId: form.values.categoryId,
    };
    try {
      if (isEdit && editId) {
        const updated = await updateTask(editId, payload);
        dispatch({ type: 'UPDATE_TASK', payload: updated });
      } else {
        const created = await createTask(payload);
        dispatch({ type: 'ADD_TASK', payload: created });
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert(
        isEdit ? 'Update failed' : 'Create failed',
        (e as ApiError).message || 'Could not save the task.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <InputField
          label="Title *"
          icon="text-outline"
          value={form.values.title}
          onChangeText={(t) => form.handleChange('title', t)}
          onBlur={() => form.handleBlur('title')}
          error={form.errors.title}
          touched={form.touched.title}
          placeholder="e.g. Finish SWE201 assignment"
          maxLength={80}
        />

        <InputField
          label="Description"
          value={form.values.description}
          onChangeText={(t) => form.handleChange('description', t)}
          onBlur={() => form.handleBlur('description')}
          error={form.errors.description}
          touched={form.touched.description}
          placeholder="Optional details..."
          multiline
          maxLength={500}
        />

        {/* Status picker */}
        <Text style={styles.label}>Status</Text>
        <View style={styles.row}>
          {TASK_STATUSES.map((s: TaskStatus) => {
            const active = form.values.status === s;
            const meta = statusMeta(s);
            return (
              <TouchableOpacity
                key={s}
                onPress={() => form.handleChange('status', s)}
                style={[styles.option, active && styles.optionActive]}
              >
                <Icon name={meta.icon} size={15} color={active ? '#ffffff' : theme.colors.textMuted} />
                <Text style={[styles.optionText, active && styles.optionTextActive]}>
                  {meta.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Category picker (secondary entity) */}
        <Text style={styles.label}>Category *</Text>
        <View style={styles.row}>
          {categories.map((c) => {
            const active = String(form.values.categoryId) === String(c.id);
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => form.handleChange('categoryId', String(c.id))}
                style={[styles.option, active && styles.optionActive]}
              >
                <Text style={[styles.optionText, active && styles.optionTextActive]}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {form.touched.categoryId && form.errors.categoryId ? (
          <Text style={styles.error}>{form.errors.categoryId}</Text>
        ) : null}

        <Button
          title={isEdit ? 'Save Changes' : 'Create Task'}
          icon={isEdit ? 'save-outline' : 'add'}
          onPress={onSubmit}
          loading={submitting}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 24 },
  label: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  optionActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  optionText: { color: theme.colors.textMuted, fontWeight: '600' },
  optionTextActive: { color: '#ffffff' },
  error: { color: theme.colors.danger, fontSize: 13, marginTop: -8, marginBottom: 12 },
});
