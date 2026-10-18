import Database from "@tauri-apps/plugin-sql";
import type { Editor } from "@tiptap/core";
import { DATABASE_NAME } from "@/lib/constants";
import { getMemo } from "@/lib/db/read";
import type { ArgsForSaveMemo } from "@/lib/memo";

export function isEmpty(content: ReturnType<Editor["getJSON"]>) {
	return !Object.keys(content.content[0]).includes("content");
	// if (isEmpty) {
	// 	console.log("빈 문서");
	// } else {
	// 	const dataToSave = JSON.stringify(content);
	// 	console.log(dataToSave);
	// }
}

export async function saveMemo(args: ArgsForSaveMemo) {
	const { caseId, sectionCategory, contents } = args;

	try {
		console.log("contents to save: ", contents);
		const db = await Database.load(DATABASE_NAME);

		const isUpdate = !!(await getMemo({
			caseId,
			sectionCategory,
			hearingId: sectionCategory === "hearings" ? args.hearingId : undefined,
		}));

		if (isUpdate) {
			let queryForUpdate =
				"UPDATE memos SET contents = $1, updated_at = CURRENT_TIMESTAMP WHERE case_id = $2 AND section_type = $3";
			const bindValuesForUpdate: string[] = [
				JSON.stringify(contents),
				caseId,
				sectionCategory,
			];

			if (sectionCategory === "hearings") {
				queryForUpdate += " AND hearing_id = $4";
				bindValuesForUpdate.push(args.hearingId);
			}

			const result = await db.execute(queryForUpdate, bindValuesForUpdate);
			console.log("Memo updated:", result);
		} else {
			let queryForInsert =
				"INSERT INTO memos (case_id, section_type, contents) VALUES ($1, $2, $3)";
			const bindValuesForInsert: string[] = [
				caseId,
				sectionCategory,
				JSON.stringify(contents),
			];

			if (sectionCategory === "hearings") {
				queryForInsert =
					"INSERT INTO memos (case_id, section_type, hearing_id, contents) VALUES ($1, $2, $3, $4)";
				bindValuesForInsert.splice(2, 0, args.hearingId);
				console.log("bindValuesForInsert: ", bindValuesForInsert);
			}
			const result = await db.execute(queryForInsert, bindValuesForInsert);
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
