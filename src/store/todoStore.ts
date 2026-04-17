import { create } from 'zustand';
import { Todo, TodoFormData, TodoStatus } from '../types';
import api from '../services/api';

interface TodoState {
  todos: Todo[];
  loading: boolean;
  fetchTodos: () => Promise<void>;
  createTodo: (data: TodoFormData) => Promise<void>;
  updateTodo: (id: string, data: Partial<TodoFormData>) => Promise<void>;
  moveTodo: (id: string, status: TodoStatus, position: number) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  loading: false,

  fetchTodos: async () => {
    set({ loading: true });
    const { data } = await api.get<Todo[] | { data: Todo[] }>('/todos');
    const todos = Array.isArray(data) ? data : data.data;
    set({ todos, loading: false });
  },

  createTodo: async (formData) => {
    const { data } = await api.post<Todo>('/todos', formData);
    set((s) => ({ todos: [...s.todos, data] }));
  },

  updateTodo: async (id, formData) => {
    const { data } = await api.put<Todo>(`/todos/${id}`, formData);
    set((s) => ({ todos: s.todos.map((t) => (t.id === id ? data : t)) }));
  },

  moveTodo: async (id, status, position) => {
    const { data } = await api.patch<Todo>(`/todos/${id}/move`, { status, position });
    set((s) => ({ todos: s.todos.map((t) => (t.id === id ? data : t)) }));
  },

  deleteTodo: async (id) => {
    await api.delete(`/todos/${id}`);
    set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }));
  },
}));
