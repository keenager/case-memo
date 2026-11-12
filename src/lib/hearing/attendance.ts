import { toSnake } from "@/lib/camelize";
import { getDB } from "@/lib/db/db";
import { handleError } from "@/lib/error";

export const saveAttendanceStatus = async (
	hearingId: string,
	name: string,
	status: boolean,
) => {
	const snakeName = toSnake(name);
	const snakeName2 = getOppositeName(snakeName);

	// console.log(
	// 	`저장할 내용: 기일 ID ${hearingId} ${snakeName} = ${status} ${snakeName2} = ${!status} 출석 = ${attended}, 불출석 = ${notAttended}`,
	// );
	try {
		const db = await getDB();
		await db.execute(
			`UPDATE hearings SET ${snakeName}=$1, ${snakeName2}=$2, updated_at=CURRENT_TIMESTAMP WHERE id=$3`,
			[status ? 1 : 0, status ? 0 : 1, hearingId],
		);
	} catch (error) {
		handleError(error);
	}
};
export const saveNoStateStatus = async (
	hearingId: string,
	name: string,
	status: boolean,
) => {
	const snakeName = toSnake(name);
	try {
		const db = await getDB();
		await db.execute(
			`UPDATE hearings SET ${snakeName}_no_state=$1, updated_at=CURRENT_TIMESTAMP WHERE id=$2`,
			[status ? 1 : 0, hearingId],
		);
	} catch (error) {
		handleError(error);
	}
};

const getOppositeName = (name: string) => {
	const arr = name.split("_");
	return arr.includes("not")
		? arr.toSpliced(arr.indexOf("not"), 1).join("_")
		: arr.toSpliced(arr.length - 1, 0, "not").join("_");
};
