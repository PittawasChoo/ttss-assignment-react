import { useState, useEffect } from "react";

import type { Todo } from "types/todo";

import { isoToLocalInput, localInputToIso } from "utils/time";

import {
    Form,
    Row,
    Label,
    TextInput,
    DateInput,
    Footer,
    CancelButton,
    SubmitButton,
} from "./TodoEditor.styles";

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
        <Form onSubmit={submit}>
            <Row>
                <Label>Description:</Label>
                <TextInput
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description"
                    autoFocus
                />
            </Row>

            <Row>
                <Label>Due date:</Label>
                <DateInput
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </Row>

            <Footer>
                <CancelButton type="button" onClick={onCancel}>
                    Cancel
                </CancelButton>
                <SubmitButton type="submit">{mode === "add" ? "Add task" : "Save"}</SubmitButton>
            </Footer>
        </Form>
    );
}
