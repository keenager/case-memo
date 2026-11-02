import type { Editor } from "@tiptap/core";
import { getDB } from "@/lib/db/db";
import { getMemo } from "@/lib/db/read";
import type { ArgsForSaveMemo } from "@/lib/memo/types";
import { useMemo } from "@/store/memo";

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
	// const setCurrentMemoId = useMemo((state) => state.setCurrentMemoId);

	console.log("contents to save: ", contents);
	const db = await getDB();

	const existingMemo = await getMemo({
		caseId,
		sectionCategory,
		hearingId: sectionCategory === "hearings" ? args.hearingId : undefined,
	});

	if (existingMemo) {
		const result = await db.execute(
			`UPDATE memos SET contents = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
			[JSON.stringify(contents), existingMemo.id],
		);
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
			// console.log("bindValuesForInsert: ", bindValuesForInsert);
		}
		const result = await db.execute(queryForInsert, bindValuesForInsert);
		useMemo.getState().setCurrentMemoId(result.lastInsertId);
		console.log("Memo saved:", result);
	}

	// const tables = await db.select(
	// 	"SELECT name FROM sqlite_master WHERE type='table'",
	// );
	// console.log("Tables:", tables);
}
