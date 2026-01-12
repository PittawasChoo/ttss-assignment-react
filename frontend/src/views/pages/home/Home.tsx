import { useState } from "react";
import { useTodos } from "contexts/TodosContext";
import TodoItem from "components/todo-item/TodoItem";
import TodoEditor from "components/todo-editor/TodoEditor";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

type ActiveForm = { type: "add" } | { type: "edit"; todoId: string } | null;

export default function Home() {
    const { todos, addTodo, editTodo, removeTodo, toggleDone, reorderTodos } = useTodos();
    const [activeForm, setActiveForm] = useState<ActiveForm>(null);
    const sensors = useSensors(useSensor(PointerSensor));

    return (
        <div style={{ padding: 16, maxWidth: 720, margin: "0 auto" }}>
            <h2>Todos</h2>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => {
                    const { active, over } = event;
                    if (!over || active.id === over.id) return;

                    const fromIndex = todos.findIndex((t) => t.id === active.id);
                    const toIndex = todos.findIndex((t) => t.id === over.id);

                    reorderTodos(fromIndex, toIndex);
                }}
            >
                <SortableContext
                    items={todos.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {todos.map((t) =>
                            activeForm?.type === "edit" && activeForm.todoId === t.id ? (
                                <TodoEditor
                                    key={t.id}
                                    mode="edit"
                                    initial={{ description: t.description, dueDate: t.dueDate }}
                                    onCancel={() => setActiveForm(null)}
                                    onSubmit={async (data) => {
                                        await editTodo(t.id, data);
                                        setActiveForm(null);
                                    }}
                                />
                            ) : (
                                <TodoItem
                                    key={t.id}
                                    todo={t}
                                    isDragDisabled={!!activeForm}
                                    onToggle={toggleDone}
                                    onDelete={removeTodo}
                                    onEditClick={(id) =>
                                        setActiveForm({ type: "edit", todoId: id })
                                    }
                                />
                            )
                        )}
                    </div>
                </SortableContext>
            </DndContext>

            {/* ADD FORM OR PLUS BUTTON */}
            <div style={{ marginTop: 16 }}>
                {activeForm?.type === "add" ? (
                    <TodoEditor
                        mode="add"
                        onCancel={() => setActiveForm(null)}
                        onSubmit={async (data) => {
                            await addTodo(data);
                            setActiveForm(null);
                        }}
                    />
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <button
                            onClick={() => setActiveForm({ type: "add" })}
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                fontSize: 24,
                                border: "1px solid rgba(0,0,0,0.15)",
                                background: "#fff",
                                cursor: "pointer",
                            }}
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
