import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import editIcon from "assets/edit.png";
import deleteIcon from "assets/delete.png";
import DragIcon from "assets/drag.png";

import type { Todo } from "types/todo";

import { formatLocalDateTime, isOverdue } from "utils/time";

import IconButton from "../icon-button/IconButton";

import {
    Wrapper,
    Left,
    DragHandle,
    Content,
    Description,
    DueDate,
    Actions,
} from "./TodoItem.styles";

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

    const isOverdueTask = isOverdue(todo.dueDate) && !todo.isFinished;

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <Wrapper>
                <Left>
                    <DragHandle
                        src={DragIcon}
                        alt="Drag"
                        disabled={isDragDisabled}
                        {...(!isDragDisabled ? listeners : {})}
                    />

                    <input
                        type="checkbox"
                        checked={todo.isFinished}
                        onChange={() => onToggle(todo.id)}
                    />

                    <Content>
                        <div>
                            <Description finished={todo.isFinished}>{todo.description}</Description>
                        </div>
                        <DueDate overdue={isOverdueTask}>
                            Due: {formatLocalDateTime(todo.dueDate)}
                        </DueDate>
                    </Content>
                </Left>

                <Actions>
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
                </Actions>
            </Wrapper>
        </div>
    );
}
