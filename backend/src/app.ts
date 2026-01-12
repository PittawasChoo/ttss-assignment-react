import express from "express";
import cors from "cors";

import { todoRouter } from "./routes/todos.routes.js";

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use("/api", todoRouter);

    // simple health check
    app.get("/health", (_req, res) => res.json({ ok: true }));

    return app;
}
