export interface User {
  id: string;
  name: string;
  email: string;
}

export type TodoStatus = 'pending' | 'in_progress' | 'done';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface TodoFormData {
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  deadline?: string | null;
}
