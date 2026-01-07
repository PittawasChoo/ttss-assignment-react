import type { Todo } from "../types/todo";

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  if (!res.ok) {
    const msg = await res.json().catch(() => ({}));
    throw new Error(msg?.message || `Request failed (${res.status})`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const todosApi = {
  list: () => request<Todo[]>("/api/todos"),
  create: (title: string) =>
    request<Todo>("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),
  update: (id: string, patch: Partial<Pick<Todo, "title" | "done">>) =>
    request<Todo>(`/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  remove: (id: string) =>
    request<void>(`/api/todos/${id}`, { method: "DELETE" }),
};
