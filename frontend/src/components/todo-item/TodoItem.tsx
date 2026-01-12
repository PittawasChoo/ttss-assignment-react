import type { Todo } from "../../types/todo";
import IconButton from "../icon-button/IconButton";
import editIcon from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";
import { formatLocalDateTime } from "../../utils/time";

import DragIcon from "assets/drag.png";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
    todo: Todo;
    isDragDisabled: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEditClick: (id: string) => void;
};

export default function TodoItem({ todo, isDragDisabled, onToggle, onDelete, onEditClick }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: todo.id,
        disabled: isDragDisabled,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <div
                style={{
                    padding: 12,
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    width: 400,
                }}
            >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <img
                        src={DragIcon}
                        width={16}
                        height={16}
                        style={{
                            cursor: isDragDisabled ? "not-allowed" : "grab",
                            opacity: isDragDisabled ? 0.4 : 1,
                        }}
                        {...(!isDragDisabled ? listeners : {})}
                    />

                    <input
                        type="checkbox"
                        checked={todo.isFinished}
                        onChange={() => onToggle(todo.id)}
                    />

                    <div>
                        <div>
                            <span
                                style={{
                                    textDecoration: todo.isFinished ? "line-through" : "none",
                                }}
                            >
                                {todo.description}
                            </span>
                        </div>
                        <small style={{ opacity: 0.7 }}>
                            Due: {formatLocalDateTime(todo.dueDate)}
                        </small>
                    </div>
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                    <IconButton
                        src={editIcon}
                        alt="Edit"
                        onClick={() => onEditClick(todo.id)}
                        width={16}
                        height={16}
                    />
                    <IconButton
                        src={deleteIcon}
                        alt="Delete"
                        onClick={() => onDelete(todo.id)}
                        width={16}
                        height={16}
                    />
                </div>
            </div>
        </div>
    );
}
