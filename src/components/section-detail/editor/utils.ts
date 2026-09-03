import DataBase from "@tauri-apps/plugin-sql";
import type { Editor } from "@tiptap/core";

export function isEmpty(content: ReturnType<Editor["getJSON"]>) {
	return !Object.keys(content.content[0]).includes("content");
	// if (isEmpty) {
	// 	console.log("빈 문서");
	// } else {
	// 	const dataToSave = JSON.stringify(content);
	// 	console.log(dataToSave);
	// }
}

export async function saveMemo(content: ReturnType<Editor["getJSON"]>) {
	try {
		console.log("contents to save: ", content);
		const db = await DataBase.load("sqlite:test.db");

		const result = await db.execute(
			//case_id는 foreign key로 연결되어 있어, 실제로는 case_id를 받아와야 함. 현재는 임시로 "caseId"라는 문자열을 넣어둠.
			"INSERT INTO memos (case_id, section_type, content) VALUES ($1, $2)",
			["caseId", "tempSectionType", JSON.stringify(content)],
		);
		console.log("Memo saved:", result);

		const tables = await db.select(
			"SELECT name FROM sqlite_master WHERE type='table'",
		);
		console.log("Tables:", tables);
	} catch (error) {
		console.log("Error saving memo:", error);
	}
}
