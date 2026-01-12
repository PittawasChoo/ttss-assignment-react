import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { todosApi } from "../api/todosApi";
import type { Todo } from "../types/todo";

type TodoContextValue = {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  mutating: boolean;

  refresh: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  editTodo: (id: string, title: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
};

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const data = await todosApi.list();
      setTodos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function addTodo(title: string) {
    setError(null);
    setMutating(true);
    try {
      const created = await todosApi.create(title);
      setTodos((prev) => [created, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setMutating(false);
    }
  }

  async function editTodo(id: string, title: string) {
    setError(null);
    setMutating(true);
    try {
      const updated = await todosApi.update(id, { title });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setMutating(false);
    }
  }

  async function toggleTodo(id: string) {
    setError(null);
    setMutating(true);
    try {
      const current = todos.find((t) => t.id === id);
      if (!current) return;
      const updated = await todosApi.update(id, { done: !current.done });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setMutating(false);
    }
  }

  async function deleteTodo(id: string) {
    setError(null);
    setMutating(true);
    try {
      await todosApi.remove(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setMutating(false);
    }
  }

  const value = useMemo(
    () => ({
      todos,
      loading,
      error,
      mutating,
      refresh,
      addTodo,
      editTodo,
      toggleTodo,
      deleteTodo,
    }),
    [todos, loading, error, mutating]
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodos must be used within TodoProvider");
  return ctx;
}
