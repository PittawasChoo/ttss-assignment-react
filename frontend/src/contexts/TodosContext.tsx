import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

import * as todosApi from "apis/todosApi";

import toast from "react-hot-toast";

import type { Todo, CreateTodoInput, UpdateTodoInput } from "types/todo";

import { arrayMove } from "../utils/reorder";

type State = {
    todos: Todo[];
    loading: boolean; // initial/refresh fetch
    error: string | null;
};

type Action =
    | { type: "LOAD_START" }
    | { type: "LOAD_SUCCESS"; todos: Todo[] }
    | { type: "LOAD_ERROR"; error: string }
    | { type: "SET_TODOS"; todos: Todo[] };

const initialState: State = { todos: [], loading: false, error: null };

function sortByPosition(todos: Todo[]) {
    return [...todos].sort((a, b) => a.position - b.position);
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "LOAD_START":
            return { ...state, loading: true, error: null };
        case "LOAD_SUCCESS":
            return { ...state, loading: false, todos: sortByPosition(action.todos), error: null };
        case "LOAD_ERROR":
            return { ...state, loading: false, error: action.error };
        case "SET_TODOS":
            return { ...state, todos: sortByPosition(action.todos) };
        default:
            return state;
    }
}

type TodosContextValue = {
    todos: Todo[];
    loading: boolean;
    error: string | null;

    refresh: () => Promise<void>;
    addTodo: (input: CreateTodoInput) => Promise<void>;
    editTodo: (id: string, input: UpdateTodoInput) => Promise<void>;
    removeTodo: (id: string) => Promise<void>;
    toggleDone: (id: string) => Promise<void>;

    reorderTodos: (fromIndex: number, toIndex: number) => Promise<void>;
};

const TodosContext = createContext<TodosContextValue | null>(null);

function upsertById(list: Todo[], todo: Todo) {
    const idx = list.findIndex((t) => t.id === todo.id);
    if (idx === -1) return [...list, todo];
    const next = list.slice();
    next[idx] = todo;
    return next;
}

export function TodosProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const refresh = async () => {
        dispatch({ type: "LOAD_START" });
        try {
            const todos = await todosApi.fetchTodos();
            dispatch({ type: "LOAD_SUCCESS", todos });
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Unknown error";
            dispatch({ type: "LOAD_ERROR", error: msg });
        }
    };

    useEffect(() => {
        void refresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Add: optimistic insert (no global loading)
    const addTodo = async (input: CreateTodoInput) => {
        const prev = state.todos;

        // temp optimistic item
        const tempId = `temp-${Date.now()}`;
        const maxPos = prev.reduce((m, t) => Math.max(m, t.position), 0);
        const optimistic: Todo = {
            id: tempId,
            description: input.description,
            dueDate: input.dueDate,
            isFinished: input.isFinished ?? false,
            position: maxPos + 1,
        };

        dispatch({ type: "SET_TODOS", todos: [...prev, optimistic] });

        try {
            const created = await todosApi.createTodo(input);

            // replace temp with real
            const replaced = state.todos.filter((t) => t.id !== tempId).concat(created);

            dispatch({ type: "SET_TODOS", todos: replaced });
        } catch (e) {
            dispatch({ type: "SET_TODOS", todos: prev });
            toast.error(e instanceof Error ? e.message : "Failed to add todo");
        }
    };

    // optimistic patch + rollback on error
    const editTodo = async (id: string, input: UpdateTodoInput) => {
        const prev = state.todos;
        const current = prev.find((t) => t.id === id);
        if (!current) return;

        const optimistic: Todo = { ...current, ...input };
        dispatch({
            type: "SET_TODOS",
            todos: prev.map((t) => (t.id === id ? optimistic : t)),
        });

        try {
            const updated = await todosApi.updateTodo(id, input);
            dispatch({ type: "SET_TODOS", todos: upsertById(prev, updated) });
        } catch (e) {
            dispatch({ type: "SET_TODOS", todos: prev });
            toast.error(e instanceof Error ? e.message : "Failed to update todo");
        }
    };

    // Delete: optimistic remove + rollback on error
    const removeTodo = async (id: string) => {
        const prev = state.todos;
        dispatch({ type: "SET_TODOS", todos: prev.filter((t) => t.id !== id) });

        try {
            await todosApi.deleteTodo(id);
            // no-op; keep optimistic state
        } catch (e) {
            dispatch({ type: "SET_TODOS", todos: prev });
            toast.error(e instanceof Error ? e.message : "Failed to delete todo");
        }
    };

    // Toggle: optimistic flip (NO LOADING) + rollback + toast on error
    const toggleDone = async (id: string) => {
        const prev = state.todos;
        const current = prev.find((t) => t.id === id);
        if (!current) return;

        const optimistic: Todo = { ...current, isFinished: !current.isFinished };

        dispatch({
            type: "SET_TODOS",
            todos: prev.map((t) => (t.id === id ? optimistic : t)),
        });

        try {
            await todosApi.updateTodo(id, { isFinished: optimistic.isFinished });
        } catch (e) {
            dispatch({ type: "SET_TODOS", todos: prev });
            toast.error(e instanceof Error ? e.message : "Failed to update todo");
        }
    };

    // Reorder list
    const reorderTodos = async (fromIndex: number, toIndex: number) => {
        const prev = state.todos;

        if (fromIndex === toIndex) return;

        const reordered = arrayMove(prev, fromIndex, toIndex).map((t, i) => ({
            ...t,
            position: i + 1,
        }));

        // ✅ optimistic update
        dispatch({ type: "SET_TODOS", todos: reordered });

        try {
            // persist only moved item (backend already normalizes)
            const movedTodo = reordered[toIndex];
            await todosApi.updateTodo(movedTodo.id, { position: movedTodo.position });
        } catch (e) {
            dispatch({ type: "SET_TODOS", todos: prev });
            toast.error("Failed to reorder todos");
        }
    };

    const value = useMemo<TodosContextValue>(
        () => ({
            todos: state.todos,
            loading: state.loading,
            error: state.error,
            refresh,
            addTodo,
            editTodo,
            removeTodo,
            toggleDone,
            reorderTodos,
        }),
        [state.todos, state.loading, state.error]
    );

    return <TodosContext.Provider value={value}>{children}</TodosContext.Provider>;
}

export function useTodos() {
    const ctx = useContext(TodosContext);
    if (!ctx) throw new Error("useTodos must be used within TodosProvider");
    return ctx;
}
