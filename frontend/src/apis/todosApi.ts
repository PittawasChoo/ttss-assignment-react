import type { Todo, CreateTodoInput, UpdateTodoInput } from "../types/todo";

const BASE_URL = "http://localhost:4000/api"; // This should be stored in an environment variable in production

async function handleRes<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let msg = `Request failed (${res.status})`;
        try {
            const data = await res.json();
            if (data?.message) msg = data.message;
        } catch {}
        throw new Error(msg);
    }
    return res.json() as Promise<T>;
}

export async function fetchTodos(signal?: AbortSignal): Promise<Todo[]> {
    const res = await fetch(`${BASE_URL}/todos`, { signal });
    return handleRes<Todo[]>(res);
}

export async function createTodo(payload: CreateTodoInput): Promise<Todo> {
    const res = await fetch(`${BASE_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleRes<Todo>(res);
}

export async function updateTodo(id: string, payload: UpdateTodoInput): Promise<Todo> {
    const res = await fetch(`${BASE_URL}/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return handleRes<Todo>(res);
}

export async function deleteTodo(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`Delete failed (${res.status})`);
}
