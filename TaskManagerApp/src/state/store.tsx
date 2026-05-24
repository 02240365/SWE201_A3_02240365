import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  ReactNode,
  Dispatch,
} from 'react';
import type { AuthData, Task, Category, Filter } from '../types';

/**
 * Global app state using Context API + useReducer.
 *
 * Components read slices via selector hooks (useTasks, useAuthState, ...)
 * and dispatch typed actions via useAppDispatch().
 */

export interface AppState {
  auth: AuthData | null;
  tasks: Task[];
  categories: Category[];
  filter: Filter;
  hydrated: boolean;
}

const initialState: AppState = {
  auth: null,
  tasks: [],
  categories: [],
  filter: { status: 'all', query: '' },
  hydrated: false,
};

// Discriminated union of every action the reducer understands.
export type Action =
  | { type: 'HYDRATE'; payload: Partial<AppState> }
  | { type: 'SET_AUTH'; payload: AuthData }
  | { type: 'CLEAR_AUTH' }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'REMOVE_TASK'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_FILTER'; payload: Partial<Filter> };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      // Merge persisted slices loaded from AsyncStorage on app start.
      return { ...state, ...action.payload, hydrated: true };

    case 'SET_AUTH':
      return { ...state, auth: action.payload };

    case 'CLEAR_AUTH':
      // Logging out also clears any loaded data.
      return { ...state, auth: null, tasks: [], categories: [] };

    case 'SET_TASKS':
      return { ...state, tasks: action.payload };

    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          String(t.id) === String(action.payload.id) ? { ...t, ...action.payload } : t
        ),
      };

    case 'REMOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => String(t.id) !== String(action.payload)),
      };

    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'SET_FILTER':
      return { ...state, filter: { ...state.filter, ...action.payload } };

    default:
      return state;
  }
}

const StateContext = createContext<AppState | null>(null);
const DispatchContext = createContext<Dispatch<Action> | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Memoize so consumers don't re-render unnecessarily.
  const stateValue = useMemo(() => state, [state]);
  return (
    <StateContext.Provider value={stateValue}>
      <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// ---- Low-level hooks ----
export function useAppState(): AppState {
  const ctx = useContext(StateContext);
  if (ctx === null) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

export function useAppDispatch(): Dispatch<Action> {
  const ctx = useContext(DispatchContext);
  if (ctx === null) throw new Error('useAppDispatch must be used within AppProvider');
  return ctx;
}

// ---- Selector hooks (read slices of state) ----
export const useAuthState = (): AuthData | null => useAppState().auth;
export const useTasks = (): Task[] => useAppState().tasks;
export const useCategories = (): Category[] => useAppState().categories;
export const useFilter = (): Filter => useAppState().filter;
export const useHydrated = (): boolean => useAppState().hydrated;

/** Selector: find a single task by id (used by the detail screen). */
export function useTaskById(id: string): Task | null {
  const tasks = useTasks();
  return tasks.find((t) => String(t.id) === String(id)) ?? null;
}
