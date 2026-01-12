import { useState, useEffect } from "react";
import type { Todo } from "../../types/todo";
import { isoToLocalInput, localInputToIso } from "../../utils/time";

type Props = {
    mode: "add" | "edit";
    initial?: Pick<Todo, "description" | "dueDate">;
    onCancel: () => void;
    onSubmit: (data: { description: string; dueDate: string }) => Promise<void> | void;
};

export default function TodoEditor({ mode, initial, onCancel, onSubmit }: Props) {
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");

    useEffect(() => {
        if (initial) {
            setDescription(initial.description);
            setDueDate(isoToLocalInput(initial.dueDate));
        }
    }, [initial]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        await onSubmit({
            description: description.trim(),
            dueDate: dueDate ? localInputToIso(dueDate) : new Date().toISOString(),
        });
    };

    return (
        <form
            onSubmit={submit}
            style={{
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 12,
                padding: 12,
                background: "#fff",
            }}
        >
            {/* Title input */}
            <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task title"
                style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: 16,
                    marginBottom: 8,
                }}
                autoFocus
            />

            {/* Description row */}
            <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                style={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    color: "#6b7280",
                    fontSize: 14,
                }}
            />

            {/* Footer */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 8,
                    marginTop: 12,
                }}
            >
                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        border: "none",
                        background: "transparent",
                        color: "#6b7280",
                        cursor: "pointer",
                    }}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        border: "none",
                        background: "#e5a59b",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                >
                    {mode === "add" ? "Add task" : "Save"}
                </button>
            </div>
        </form>
    );
}
