import type { QueryResult } from "@tauri-apps/plugin-sql";
import { getDB } from "@/lib/db/db";
import type { TodoInFront } from "../todo/types";

export const createUpdateTodo = async (
	newTodo: Omit<TodoInFront, "id">,
	existingTodoId: string | undefined,
) => {
	const db = await getDB();
	let result: QueryResult;
	switch (typeof existingTodoId) {
		case "string":
			result = await db.execute(
				"UPDATE todos SET content = $1, due_date = $2, is_done = $3 WHERE id = $4",
				[
					newTodo.content,
					newTodo.dueDate,
					newTodo.isDone ? 1 : 0,
					existingTodoId,
				],
			);
			break;
		case "undefined":
			result = await db.execute(
				"INSERT into todos (hearing_id, content, due_date, is_done) VALUES ($1, $2, $3, $4)",
				[
					newTodo.hearingId,
					newTodo.content,
					newTodo.dueDate,
					newTodo.isDone ? 1 : 0,
				],
			);
			break;
	}
	return result;
};
