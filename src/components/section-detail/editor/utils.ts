import DataBase from "@tauri-apps/plugin-sql";
import type { Editor } from "@tiptap/core";
import type { Memo } from "@/lib/types";

export function isEmpty(content: ReturnType<Editor["getJSON"]>) {
	return !Object.keys(content.content[0]).includes("content");
	// if (isEmpty) {
	// 	console.log("빈 문서");
	// } else {
	// 	const dataToSave = JSON.stringify(content);
	// 	console.log(dataToSave);
	// }
}

export async function saveMemo(
	caseNumber: string,
	sectionType: string,
	contents: ReturnType<Editor["getJSON"]>,
) {
	try {
		console.log("contents to save: ", contents);
		const db = await DataBase.load("sqlite:test.db");

		const [{ id: caseId }] = (await db.select(
			"SELECT id FROM cases WHERE case_number = $1",
			[caseNumber],
		)) as { id: string }[];

		const existingMemo = (await db.select(
			"SELECT * FROM memos WHERE case_id = $1 AND section_type = $2",
			[caseId, sectionType],
		)) as Memo[];

		const isUpdate = existingMemo.length > 0;

		if (isUpdate) {
			const result = await db.execute(
				"UPDATE memos SET contents = $1, updated_at = CURRENT_TIMESTAMP WHERE case_id = $2 AND section_type = $3",
				[JSON.stringify(contents), caseId, sectionType],
			);
			console.log("Memo updated:", result);
		} else {
			const result = await db.execute(
				"INSERT INTO memos (case_id, section_type, contents) VALUES ($1, $2, $3)",
				[caseId, sectionType, JSON.stringify(contents)],
			);
			console.log("Memo saved:", result);
		}

		// const tables = await db.select(
		// 	"SELECT name FROM sqlite_master WHERE type='table'",
		// );
		// console.log("Tables:", tables);
	} catch (error) {
		console.log("Error saving memo:", error);
	}
}
