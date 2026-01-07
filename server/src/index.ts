import express from "express";
import cors from "cors";

type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: number;
  updatedAt: number;
};

const app = express();
app.use(cors());
app.use(express.json());

// --- In-memory DB (good enough for take-home)
let todos: Todo[] = [
  {
    id: "1",
    title: "Learn Context API",
    done: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

// simulate latency (for loading states)
app.use(async (_req, _res, next) => {
  await new Promise((r) => setTimeout(r, 500));
  next();
});

// (optional) simulate error by query: ?fail=true
app.use((req, res, next) => {
  if (req.query.fail === "true") {
    return res.status(500).json({ message: "Simulated server error" });
  }
  next();
});

app.get("/api/todos", (_req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const title = String(req.body?.title ?? "").trim();
  if (!title) return res.status(400).json({ message: "title is required" });

  const now = Date.now();
  const todo: Todo = {
    id: crypto.randomUUID(),
    title,
    done: false,
    createdAt: now,
    updatedAt: now,
  };

  todos = [todo, ...todos];
  res.status(201).json(todo);
});

app.put("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const title = req.body?.title;
  const done = req.body?.done;

  const idx = todos.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ message: "Todo not found" });

  const current = todos[idx];
  const updated: Todo = {
    ...current,
    id: current?.id || crypto.randomUUID(),
    title: typeof title === "string" ? title.trim() : current?.title || "",
    done: typeof done === "boolean" ? done : current?.done || false,
    updatedAt: Date.now(),
    createdAt: current?.createdAt || Date.now(),
  };

  if (!updated.title)
    return res.status(400).json({ message: "title is required" });

  todos[idx] = updated;
  res.json(updated);
});

app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const before = todos.length;
  todos = todos.filter((t) => t.id !== id);
  if (todos.length === before)
    return res.status(404).json({ message: "Todo not found" });
  res.status(204).send();
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
