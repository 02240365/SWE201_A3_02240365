import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Route parameter definitions for the app stack.
 * Using a typed param list gives autocomplete and compile-time checks on
 * navigation.navigate(...) calls and route.params access.
 */
export type RootStackParamList = {
  Login: undefined;
  TaskList: undefined;
  TaskDetail: { id: string };
  TaskForm: { mode: 'create' } | { mode: 'edit'; id: string };
};

export type TaskListProps = NativeStackScreenProps<RootStackParamList, 'TaskList'>;
export type TaskDetailProps = NativeStackScreenProps<RootStackParamList, 'TaskDetail'>;
export type TaskFormProps = NativeStackScreenProps<RootStackParamList, 'TaskForm'>;
