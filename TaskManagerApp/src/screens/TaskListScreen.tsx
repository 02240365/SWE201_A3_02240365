import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TaskCard from '../components/TaskCard';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { Loading, ErrorView, EmptyState } from '../components/StateViews';
import { fetchTasks } from '../api/tasks';
import { fetchCategories } from '../api/categories';
import { useAppDispatch, useTasks, useCategories, useFilter } from '../state/store';
import { saveFilter } from '../state/persistence';
import { theme, statusMeta } from '../utils/theme';
import { TASK_STATUSES } from '../config';
import type { TaskListProps } from '../navigation/types';
import type { TaskStatus } from '../types';

type StatusFilter = TaskStatus | 'all';

/**
 * Primary list screen.
 * - Fetches tasks + categories on focus (handles return-from-edit/create).
 * - Stores results in global state.
 * - Provides text search + status filter, persisting the last filter.
 */
export default function TaskListScreen({ navigation }: TaskListProps) {
  const dispatch = useAppDispatch();
  const tasks = useTasks();
  const categories = useCategories();
  const filter = useFilter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  // Load tasks + categories together; cancellable via AbortController.
  const load = useCallback(async () => {
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const [taskData, catData] = await Promise.all([
        fetchTasks(controller.signal),
        fetchCategories(controller.signal),
      ]);
      dispatch({ type: 'SET_TASKS', payload: taskData });
      dispatch({ type: 'SET_CATEGORIES', payload: catData });
    } catch (e) {
      const err = e as { type?: string; message?: string };
      if (err && err.type === 'cancel') return;
      setError(err && err.message ? err.message : 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Refetch each time the screen gains focus (initial mount + returning).
  useFocusEffect(
    useCallback(() => {
      load();
      return () => {
        if (controllerRef.current) controllerRef.current.abort();
      };
    }, [load])
  );

  const setStatusFilter = (status: StatusFilter) => {
    const next = { ...filter, status };
    dispatch({ type: 'SET_FILTER', payload: { status } });
    void saveFilter(next); // persist last selected filter
  };

  const setQuery = (query: string) => {
    dispatch({ type: 'SET_FILTER', payload: { query } });
  };

  // categoryId -> name lookup.
  const categoryName = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => {
      map[String(c.id)] = c.name;
    });
    return map;
  }, [categories]);

  // Apply search + status filter client-side.
  const visibleTasks = useMemo(() => {
    const q = (filter.query || '').trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesStatus = filter.status === 'all' || t.status === filter.status;
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [tasks, filter]);

  if (loading && tasks.length === 0) {
    return <Loading message="Loading tasks..." />;
  }

  if (error && tasks.length === 0) {
    return <ErrorView message={error} onRetry={load} />;
  }

  const chips: StatusFilter[] = ['all', ...TASK_STATUSES];

  return (
    <View style={styles.container}>
      {/* Search box */}
      <View style={styles.searchRow}>
        <Icon name="search" size={18} color={theme.colors.textMuted} />
        <TextInput
          style={styles.search}
          placeholder="Search tasks..."
          placeholderTextColor={theme.colors.textMuted}
          value={filter.query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
      </View>

      {/* Status filter chips */}
      <View style={styles.filterRow}>
        {chips.map((status) => {
          const active = filter.status === status;
          const label = status === 'all' ? 'All' : statusMeta(status).label;
          return (
            <TouchableOpacity
              key={status}
              onPress={() => setStatusFilter(status)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* List / empty state */}
      {visibleTasks.length === 0 ? (
        <EmptyState
          icon="clipboard-outline"
          title="No tasks found"
          subtitle={
            tasks.length === 0
              ? 'Create your first task to get started.'
              : 'Try a different search or filter.'
          }
          action={
            <Button
              title="Add Task"
              icon="add"
              onPress={() => navigation.navigate('TaskForm', { mode: 'create' })}
              style={{ marginTop: 16, paddingHorizontal: 32 }}
            />
          }
        />
      ) : (
        <FlatList
          data={visibleTasks}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={load}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              categoryName={categoryName[String(item.categoryId)]}
              onPress={() => navigation.navigate('TaskDetail', { id: item.id })}
            />
          )}
        />
      )}

      {/* Floating add button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('TaskForm', { mode: 'create' })}
        activeOpacity={0.85}
      >
        <Icon name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius,
    paddingHorizontal: 14,
  },
  search: { flex: 1, paddingVertical: 10, fontSize: 15, color: theme.colors.text },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, marginBottom: 8, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipText: { color: theme.colors.textMuted, fontWeight: '600', fontSize: 13 },
  chipTextActive: { color: '#ffffff' },
  list: { padding: 16, paddingTop: 8, paddingBottom: 96 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
