import { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import TodoItem from "components/todo-item/TodoItem";
import TodoEditor from "components/todo-editor/TodoEditor";

import { useTodos } from "contexts/TodosContext";

import {
    AddTaskRow,
    ErrorContaier,
    Label,
    Line,
    LoadingContainer,
    Plus,
    RefreshButton,
    TodosContainer,
} from "./Home.styles";

type ActiveForm = { type: "add" } | { type: "edit"; todoId: string } | null;

export default function Home() {
    const {
        todos,
        addTodo,
        editTodo,
        removeTodo,
        toggleDone,
        reorderTodos,
        loading,
        error,
        refresh,
    } = useTodos();
    const [activeForm, setActiveForm] = useState<ActiveForm>(null);
    const sensors = useSensors(useSensor(PointerSensor));

    if (loading) {
        return <LoadingContainer>Loading todos...</LoadingContainer>;
    }

    if (error) {
        return (
            <ErrorContaier>
                <div>Failed to load todos</div>

                <RefreshButton onClick={refresh}>Refresh</RefreshButton>
            </ErrorContaier>
        );
    }

    return (
        <>
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
                    <TodosContainer>
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
                    </TodosContainer>
                </SortableContext>
            </DndContext>

            <Line />

            {/* ADD FORM OR PLUS BUTTON */}
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
                <AddTaskRow onClick={() => setActiveForm({ type: "add" })}>
                    <Plus className="plus">
                        <span>+</span>
                    </Plus>
                    <Label className="label">Add Task</Label>
                </AddTaskRow>
            )}
        </>
    );
}
