import type { Request, Response } from "express";
import { randomUUID } from "crypto";

import { db } from "../db/index.js";
import type { Todo } from "../db/schema.js";

const isNonEmptyString = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

const isIsoDateString = (v: unknown): v is string => {
    if (typeof v !== "string") return false;
    return Number.isFinite(Date.parse(v));
};

const isNonNegativeInt = (v: unknown): v is number =>
    typeof v === "number" && Number.isInteger(v) && v >= 0;

function normalizePositions(todos: Todo[]) {
    todos.sort((a, b) => a.position - b.position).forEach((t, idx) => (t.position = idx + 1));
}

function moveByPosition(todos: Todo[], id: string, newPosition: number) {
    // newPosition is 1-based desired position
    const sorted = [...todos].sort((a, b) => a.position - b.position);

    const fromIndex = sorted.findIndex((t) => t.id === id);
    if (fromIndex === -1) return { ok: false as const };

    const item = sorted.splice(fromIndex, 1)[0]!;

    const clamped = Math.max(1, Math.min(newPosition, sorted.length + 1));
    sorted.splice(clamped - 1, 0, item);

    // write back positions
    sorted.forEach((t, i) => (t.position = i + 1));

    // mutate original array to match new order/positions
    todos.length = 0;
    todos.push(...sorted);

    return { ok: true as const };
}

// ✅ GET /todos
export async function getTodos(_req: Request, res: Response) {
    try {
        await db.read();

        const todos = [...db.data!.todos].sort((a, b) => a.position - b.position);
        return res.status(200).json(todos);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// ✅ POST /todos
export async function createTodo(req: Request, res: Response) {
    try {
        const { description, dueDate, isFinished } = req.body ?? {};

        if (!isNonEmptyString(description)) {
            return res.status(400).json({ message: "description is required" });
        }
        if (!isIsoDateString(dueDate)) {
            return res.status(400).json({ message: "dueDate must be a valid ISO date string" });
        }
        if (isFinished !== undefined && typeof isFinished !== "boolean") {
            return res.status(400).json({ message: "isFinished must be boolean" });
        }

        await db.read();

        const maxPos = db.data!.todos.reduce((m, t) => Math.max(m, t.position ?? 0), 0);

        const todo: Todo = {
            id: randomUUID(),
            description: description.trim(),
            dueDate,
            isFinished: typeof isFinished === "boolean" ? isFinished : false,
            position: maxPos + 1, // ✅ append at bottom
        };

        db.data!.todos.push(todo);
        await db.write();

        return res.status(201).json(todo);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// ✅ PATCH /todos/:id
export async function updateTodo(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { description, dueDate, isFinished, position } = req.body ?? {};

        if (!isNonEmptyString(id)) {
            return res.status(400).json({ message: "id param is required" });
        }

        // validate only provided fields
        if (description !== undefined && !isNonEmptyString(description)) {
            return res.status(400).json({ message: "description must be a non-empty string" });
        }
        if (dueDate !== undefined && !isIsoDateString(dueDate)) {
            return res.status(400).json({ message: "dueDate must be a valid ISO date string" });
        }
        if (isFinished !== undefined && typeof isFinished !== "boolean") {
            return res.status(400).json({ message: "isFinished must be boolean" });
        }
        if (position !== undefined && !isNonNegativeInt(position)) {
            return res
                .status(400)
                .json({ message: "position must be an integer (>= 0). Use 1..n in practice." });
        }

        await db.read();

        const idx = db.data!.todos.findIndex((t) => t.id === id);
        if (idx === -1) {
            return res.status(404).json({ message: "Todo not found" });
        }

        // update basic fields
        const existing = db.data!.todos[idx];
        const updated: Todo = {
            id,
            ...existing,
            ...(description !== undefined
                ? { description: description.trim() }
                : { description: "" }),
            ...(dueDate !== undefined ? { dueDate } : { dueDate: "" }),
            ...(isFinished !== undefined ? { isFinished } : { isFinished: false }),
            ...(position !== undefined ? { position } : { position: 99 }),
        };
        db.data!.todos[idx] = updated;

        // update ordering if position provided
        if (position !== undefined) {
            const desired = position <= 0 ? 1 : position;
            const moved = moveByPosition(db.data!.todos, id, desired);
            if (!moved.ok) {
                return res.status(404).json({ message: "Todo not found" });
            }
        } else {
            // keep consistent positions anyway (optional safety)
            normalizePositions(db.data!.todos);
        }

        await db.write();

        const final = db.data!.todos.find((t) => t.id === id)!;
        return res.status(200).json(final);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// ✅ DELETE /todos/:id
export async function deleteTodo(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!isNonEmptyString(id)) {
            return res.status(400).json({ message: "id param is required" });
        }

        await db.read();

        const before = db.data!.todos.length;
        db.data!.todos = db.data!.todos.filter((t) => t.id !== id);

        if (db.data!.todos.length === before) {
            return res.status(404).json({ message: "Todo not found" });
        }

        // ✅ close position gaps after delete
        normalizePositions(db.data!.todos);

        await db.write();
        return res.status(204).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
