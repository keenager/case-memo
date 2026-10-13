import DataBase from "@tauri-apps/plugin-sql";
import type { Editor } from "@tiptap/core";
import { DATABASE_NAME } from "@/lib/constants";
import type { ArgsForSaveMemo, Memo } from "@/lib/types";

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
	try {
		console.log("contents to save: ", args.contents);
		const db = await DataBase.load(DATABASE_NAME);

		const [{ id: caseId }] = (await db.select(
			"SELECT id FROM cases WHERE case_number = $1",
			[args.caseNumber],
		)) as { id: string }[];

		let queryForExistingMemo =
			"SELECT * FROM memos WHERE case_id = $1 AND section_type = $2";
		const bindValues: string[] = [caseId, args.sectionCategory];

		if (args.sectionCategory === "hearings") {
			queryForExistingMemo += " AND hearing_id = $3";
			bindValues.push(args.hearingId);
		}

		const existingMemo = (await db.select(
			queryForExistingMemo,
			bindValues,
		)) as Memo[];

		const isUpdate = existingMemo.length > 0;

		if (isUpdate) {
			let queryForUpdate =
				"UPDATE memos SET contents = $1, updated_at = CURRENT_TIMESTAMP WHERE case_id = $2 AND section_type = $3";
			const bindValuesForUpdate: string[] = [
				JSON.stringify(args.contents),
				caseId,
				args.sectionCategory,
			];

			if (args.sectionCategory === "hearings") {
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
				args.sectionCategory,
				JSON.stringify(args.contents),
			];

			if (args.sectionCategory === "hearings") {
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
