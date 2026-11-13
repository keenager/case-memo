import type { QueryResult } from "@tauri-apps/plugin-sql";
import { getDB } from "@/lib/db/db";
import { formattedDate } from "../date";
import type { TodoInFront } from "../todo/todo";

export const createUpdateTodo = async (
	newTodo: Omit<TodoInFront, "id">,
	existingTodoId: string | undefined,
) => {
	const db = await getDB();
	let result: QueryResult;
	switch (typeof existingTodoId) {
		case "string":
			result = await db.execute(
				"UPDATE todos SET content = $1, due_date = $2 WHERE id = $3",
				[newTodo.content, formattedDate(newTodo.dueDate), existingTodoId],
			);
			break;
		case "undefined":
			result = await db.execute(
				"INSERT into todos (hearing_id, content, due_date) VALUES ($1, $2, $3)",
				[newTodo.hearingId, newTodo.content, newTodo.dueDate],
			);
			break;
	}
	return result;
};
