export type Todo = {
    id: string;
    description: string;
    dueDate: string;
    isFinished: boolean;
    position: number;
};

export type DbSchema = {
    todos: Todo[];
};
