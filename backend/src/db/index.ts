import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import type { DbSchema } from "./schema.js";

const adapter = new JSONFile<DbSchema>(new URL("../../db/db.json", import.meta.url));
export const db = new Low<DbSchema>(adapter, { todos: [] });

export async function initDb() {
    await db.read();

    db.data ||= { todos: [] };
    db.data.todos ||= [];

    await db.write();
}
