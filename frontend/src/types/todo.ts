export type Todo = {
    id: string;
    description: string;
    dueDate: string;
    isFinished: boolean;
    position: number;
};

export type CreateTodoInput = {
    description: string;
    dueDate: string;
    isFinished?: boolean;
};

export type UpdateTodoInput = Partial<
    Pick<Todo, "description" | "dueDate" | "isFinished" | "position">
>;
