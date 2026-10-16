import Database from "@tauri-apps/plugin-sql";
import { camelizeKeys, type SnakeCase } from "@/lib/camelize";
import { DATABASE_NAME } from "@/lib/constants";
import type { Memo } from "@/lib/memo";
import type { Hearing } from "./hearing";
import type { SectionCategory } from "./sections";

export const getMemo = async ({
	caseId,
	sectionCategory,
	hearingId,
}: {
	caseId: string;
	sectionCategory: SectionCategory;
	hearingId?: string;
}) => {
	const db = await Database.load(DATABASE_NAME);
	let query = `SELECT * FROM memos WHERE case_id = $1 AND section_type = $2`;
	const values = [caseId, sectionCategory];
	if (sectionCategory === "hearings" && hearingId) {
		query += ` AND hearing_id = $3`;
		values.push(hearingId);
	}
	const result = (await db.select(query, values)) as SnakeCase<Memo>[];
	console.log("loadedMemo: ", result);

	return result.length > 0 ? camelizeKeys(result[0]) : undefined;
};

export const getCaseNumber = async (caseId: string) => {
	const db = await Database.load(DATABASE_NAME);
	const { case_number } = (await db.select(
		`SELECT case_number FROM cases WHERE id = $1`,
		[caseId],
	)) as { case_number: string };
	return case_number;
};

export const getHearingData = async (caseId: string, hearingId?: string) => {
	const db = await Database.load(DATABASE_NAME);
	if (hearingId) {
		const [loadedHearingData] = (await db.select(
			`SELECT * FROM hearings WHERE case_id=$1 AND id = $2`,
			[caseId, hearingId],
		)) as SnakeCase<Hearing>[];
		return camelizeKeys(loadedHearingData);
	} else {
		const loadedHearingDataList: SnakeCase<Hearing>[] = await db.select(
			"SELECT * FROM hearings WHERE case_id = $1 ORDER BY hearing_date ASC, hearing_time ASC",
			[caseId],
		);
		return loadedHearingDataList.map((row) => camelizeKeys(row));
	}
};
