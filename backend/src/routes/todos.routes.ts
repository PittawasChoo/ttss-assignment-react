import { Router } from "express";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../controllers/todos.controller.js";

export const todoRouter = Router();

todoRouter.get("/todos", getTodos);
todoRouter.post("/todos", createTodo);
todoRouter.patch("/todos/:id", updateTodo);
todoRouter.delete("/todos/:id", deleteTodo);
